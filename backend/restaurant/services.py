from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.twilio_client = None

    def _get_client(self):
        if self.twilio_client is None:
            sid = settings.TWILIO_ACCOUNT_SID
            token = settings.TWILIO_AUTH_TOKEN
            if not sid or not token:
                return None
            self.twilio_client = Client(sid, token)
        return self.twilio_client
    
    def send_order_confirmation_email(self, order):
        """Send order confirmation email to customer"""
        try:
            subject = f"Order Confirmation #{order.id} - The Cafecito Club"
            
            # Render email template
            html_message = render_to_string('emails/order_confirmation.html', {
                'order': order,
                'items': order.items.all()
            })
            
            plain_message = render_to_string('emails/order_confirmation.txt', {
                'order': order,
                'items': order.items.all()
            })
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.customer_email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Order confirmation email sent to {order.customer_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send order confirmation email: {str(e)}")
            return False
    
    def send_status_update_email(self, order):
        """Send order status update email to customer"""
        try:
            status_messages = {
                'confirmed': 'Your order has been confirmed and we are preparing it!',
                'preparing': 'Your order is being crafted with love!',
                'ready': 'Your order is ready for pickup/delivery!',
                'out_for_delivery': 'Your order is on its way to you!',
                'delivered': 'Your order has been delivered. Enjoy your meal!',
                'cancelled': 'Your order has been cancelled. Please contact us if you have questions.'
            }
            
            subject = f"Order #{order.id} Status Update - {order.get_status_display()}"
            
            html_message = render_to_string('emails/status_update.html', {
                'order': order,
                'status_message': status_messages.get(order.status, 'Order status updated')
            })
            
            plain_message = render_to_string('emails/status_update.txt', {
                'order': order,
                'status_message': status_messages.get(order.status, 'Order status updated')
            })
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.customer_email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Status update email sent to {order.customer_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send status update email: {str(e)}")
            return False
    
    def send_order_notification_to_restaurant(self, order):
        """Send new order notification to restaurant"""
        try:
            subject = f"New Order #{order.id} - {order.customer_name}"
            
            html_message = render_to_string('emails/restaurant_notification.html', {
                'order': order,
                'items': order.items.all()
            })
            
            plain_message = render_to_string('emails/restaurant_notification.txt', {
                'order': order,
                'items': order.items.all()
            })
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.RESTAURANT_EMAIL],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Restaurant notification email sent for order #{order.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send restaurant notification email: {str(e)}")
            return False
    
    def send_confirmation_sms(self, order):
        """Send order confirmation SMS to customer"""
        try:
            client = self._get_client()
            if client is None:
                return

            message = f"☕ The Cafecito Club: Order #{order.id} confirmed! Total: ${order.total_amount}. Estimated time: 10-15 mins. See you soon!"

            client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=self.format_phone_number(order.customer_phone)
            )
            
            logger.info(f"Confirmation SMS sent to {order.customer_phone}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send confirmation SMS: {str(e)}")
            return False
    
    def send_status_update_sms(self, order):
        """Send status update SMS to customer"""
        try:
            client = self._get_client()
            if client is None:
                return

            status_messages = {
                'confirmed': '✅ Your order is confirmed and being prepared!',
                'preparing': '☕ Your order is being crafted!',
                'ready': '🍽️ Your order is ready!',
                'out_for_delivery': '🚗 Your order is on the way!',
                'delivered': '✨ Order delivered! Enjoy your meal!',
                'cancelled': '❌ Order cancelled. Contact us: (555) 123-4567'
            }

            status_msg = status_messages.get(order.status, 'Order status updated')
            message = f"☕ The Cafecito Club Order #{order.id}: {status_msg}"

            client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=self.format_phone_number(order.customer_phone)
            )
            
            logger.info(f"Status SMS sent to {order.customer_phone}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send status SMS: {str(e)}")
            return False
    
    def send_restaurant_notification_sms(self, order):
        """Send new order notification SMS to restaurant"""
        try:
            client = self._get_client()
            if client is None:
                return

            message = f"📱 NEW ORDER #{order.id} from {order.customer_name}. Total: ${order.total_amount}. Payment: {order.get_payment_method_display()}. Check admin panel for details."

            client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=settings.RESTAURANT_PHONE
            )
            
            logger.info(f"Restaurant notification SMS sent for order #{order.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send restaurant notification SMS: {str(e)}")
            return False
    
    def format_phone_number(self, phone):
        """Format phone number for Twilio (ensure it starts with +)"""
        phone = phone.strip().replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if not phone.startswith('+'):
            if phone.startswith('1'):
                phone = '+' + phone
            else:
                phone = '+1' + phone
        return phone
# Initialize notification service
notification_service = NotificationService()