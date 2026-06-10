from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('menu/', views.MenuItemListView.as_view(), name='menu'),
    path('orders/', views.OrderListCreateView.as_view(), name='orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:pk>/status/', views.UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('restaurant-info/', views.restaurant_info, name='restaurant-info'),
    path('webhooks/paypal/', views.PayPalWebhookView.as_view(), name='paypal-webhook'),
    path('test-notification/', views.send_test_notification, name='test-notification'),
]