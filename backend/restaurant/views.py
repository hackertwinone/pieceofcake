# restaurant/views.py - Complete file with notification triggers
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from .models import Category, MenuItem, Order
from .serializers import (CategorySerializer, MenuItemSerializer, 
                         OrderSerializer, CreateOrderSerializer)
from .services import notification_service
import logging

logger = logging.getLogger(__name__)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MenuItemListView(generics.ListAPIView):
    serializer_class = MenuItemSerializer
    
    def get_queryset(self):
        queryset = MenuItem.objects.filter(is_available=True)
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category__name=category)
        return queryset

class OrderListCreateView(generics.ListCreateAPIView):
    """GET: list active orders for KDS. POST: create a new order."""
    KDS_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

    def get_queryset(self):
        return Order.objects.filter(
            status__in=self.KDS_STATUSES
        ).order_by('created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            try:
                notification_service.send_order_confirmation_email(order)
                notification_service.send_confirmation_sms(order)
                notification_service.send_order_notification_to_restaurant(order)
                notification_service.send_restaurant_notification_sms(order)
                logger.info(f"Notifications sent for order #{order.id}")
            except Exception as e:
                logger.error(f"Failed to send notifications for order #{order.id}: {str(e)}")
            response_serializer = OrderSerializer(order)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


CreateOrderView = OrderListCreateView  # backwards-compat alias

class OrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    http_method_names = ['get', 'patch', 'head', 'options']

class UpdateOrderStatusView(generics.UpdateAPIView):
    """
    API endpoint to update order status (for restaurant staff)
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        old_status = order.status
        
        # Update the order
        response = super().patch(request, *args, **kwargs)
        
        # If status was updated successfully, send notifications
        if response.status_code == 200:
            order.refresh_from_db()
            if old_status != order.status:
                try:
                    # Send status update notifications to customer
                    notification_service.send_status_update_email(order)
                    notification_service.send_status_update_sms(order)
                    logger.info(f"Status update notifications sent for order #{order.id}")
                except Exception as e:
                    logger.error(f"Failed to send status update notifications: {str(e)}")
        
        return response

@method_decorator(csrf_exempt, name='dispatch')
class PayPalWebhookView(generics.GenericAPIView):
    """
    Webhook endpoint to handle PayPal payment notifications
    """
    def post(self, request, *args, **kwargs):
        try:
            # Parse the webhook data
            webhook_data = json.loads(request.body)
            event_type = webhook_data.get('event_type')
            
            if event_type == 'PAYMENT.CAPTURE.COMPLETED':
                # Extract payment information
                resource = webhook_data.get('resource', {})
                payment_id = resource.get('id')
                
                # Find the order by payment_id
                try:
                    order = Order.objects.get(payment_id=payment_id)
                    old_status = order.status
                    order.payment_status = 'completed'
                    order.status = 'confirmed'
                    order.save()
                    
                    # Send status update notifications if status changed
                    if old_status != order.status:
                        try:
                            notification_service.send_status_update_email(order)
                            notification_service.send_status_update_sms(order)
                            logger.info(f"Payment confirmation notifications sent for order #{order.id}")
                        except Exception as e:
                            logger.error(f"Failed to send payment confirmation notifications: {str(e)}")
                    
                except Order.DoesNotExist:
                    return Response({'error': 'Order not found'}, status=404)
            
            elif event_type == 'PAYMENT.CAPTURE.DENIED':
                resource = webhook_data.get('resource', {})
                payment_id = resource.get('id')
                
                try:
                    order = Order.objects.get(payment_id=payment_id)
                    order.payment_status = 'failed'
                    order.status = 'cancelled'
                    order.save()
                    
                    # Send cancellation notification
                    try:
                        notification_service.send_status_update_email(order)
                        notification_service.send_status_update_sms(order)
                        logger.info(f"Payment failure notifications sent for order #{order.id}")
                    except Exception as e:
                        logger.error(f"Failed to send payment failure notifications: {str(e)}")
                        
                except Order.DoesNotExist:
                    pass
            
            return Response({'status': 'success'}, status=200)
            
        except Exception as e:
            logger.error(f"PayPal webhook error: {str(e)}")
            return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def send_test_notification(request):
    """
    Test endpoint to send sample notifications (for development/testing)
    """
    try:
        order_id = request.data.get('order_id')
        notification_type = request.data.get('type', 'confirmation')
        
        if not order_id:
            return Response({'error': 'order_id is required'}, status=400)
        
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)
        
        success = True
        message = "Notifications sent successfully"
        
        if notification_type == 'confirmation':
            success &= notification_service.send_order_confirmation_email(order)
            success &= notification_service.send_confirmation_sms(order)
        elif notification_type == 'status_update':
            success &= notification_service.send_status_update_email(order)
            success &= notification_service.send_status_update_sms(order)
        elif notification_type == 'restaurant':
            success &= notification_service.send_order_notification_to_restaurant(order)
            success &= notification_service.send_restaurant_notification_sms(order)
        else:
            return Response({'error': 'Invalid notification type'}, status=400)
        
        if not success:
            message = "Some notifications failed to send"
        
        return Response({
            'success': success,
            'message': message,
            'order_id': order_id,
            'type': notification_type
        })
        
    except Exception as e:
        logger.error(f"Test notification error: {str(e)}")
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def restaurant_info(request):
    info = {
        'name': 'The Cafecito Club',
        'description': 'Your neighborhood coffee haven — crafted with love, served with warmth',
        'address': '123 Green Street, Eco City, EC 12345',
        'phone': '+1 (555) 123-4567',
        'email': 'hello@thecafecito.club',
        'hours': {
            'monday': '11:00 AM - 10:00 PM',
            'tuesday': '11:00 AM - 10:00 PM',
            'wednesday': '11:00 AM - 10:00 PM',
            'thursday': '11:00 AM - 10:00 PM',
            'friday': '11:00 AM - 11:00 PM',
            'saturday': '10:00 AM - 11:00 PM',
            'sunday': '10:00 AM - 9:00 PM'
        }
    }
    return Response(info)