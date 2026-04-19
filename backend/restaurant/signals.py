from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order
from .services import notification_service
import logging

logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Order)
def capture_old_status(sender, instance, **kwargs):
    """
    Capture the old status before saving to compare with new status
    """
    if instance.pk:
        try:
            instance._old_status = Order.objects.get(pk=instance.pk).status
        except Order.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None

@receiver(post_save, sender=Order)
def send_order_notifications(sender, instance, created, **kwargs):
    """
    Send notifications when order is created or status is updated
    """
    try:
        if created:
            # New order created - send confirmation notifications
            logger.info(f"New order #{instance.id} created, sending notifications")
            
            # Send customer notifications
            notification_service.send_order_confirmation_email(instance)
            notification_service.send_confirmation_sms(instance)
            
            # Send restaurant notifications
            notification_service.send_order_notification_to_restaurant(instance)
            notification_service.send_restaurant_notification_sms(instance)
            
            logger.info(f"Order creation notifications sent for order #{instance.id}")
            
        else:
            # Order updated - check if status changed
            old_status = getattr(instance, '_old_status', None)
            if old_status and old_status != instance.status:
                logger.info(f"Order #{instance.id} status changed from {old_status} to {instance.status}")
                
                # Send status update notifications to customer
                notification_service.send_status_update_email(instance)
                notification_service.send_status_update_sms(instance)
                
                logger.info(f"Status update notifications sent for order #{instance.id}")
                
    except Exception as e:
        logger.error(f"Failed to send notifications for order #{instance.id}: {str(e)}")
        # Don't raise the exception to avoid breaking the order save process