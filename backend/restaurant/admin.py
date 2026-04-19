from django.contrib import admin
from django.contrib import messages
from .models import Category, MenuItem, Order, OrderItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available']
    list_filter = ['category', 'is_available']
    search_fields = ['name', 'description']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['menu_item', 'quantity', 'price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'status', 'payment_method', 
                   'payment_status', 'total_amount', 'created_at']
    list_filter = ['status', 'payment_method', 'payment_status', 'created_at']
    search_fields = ['customer_name', 'customer_email', 'payment_id']
    readonly_fields = ['created_at', 'updated_at', 'total_amount', 'payment_id']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer_name', 'customer_email', 'customer_phone', 'delivery_address')
        }),
        ('Order Details', {
            'fields': ('status', 'total_amount', 'special_instructions')
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'payment_status', 'payment_id')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['mark_as_confirmed', 'mark_as_preparing', 'mark_as_ready', 'mark_as_out_for_delivery', 'mark_as_delivered']
    
    def mark_as_confirmed(self, request, queryset):
        updated = queryset.update(status='confirmed')
        messages.success(request, f'{updated} orders marked as confirmed. Notifications sent to customers.')
    mark_as_confirmed.short_description = "Mark selected orders as confirmed"
    
    def mark_as_preparing(self, request, queryset):
        updated = queryset.update(status='preparing')
        messages.success(request, f'{updated} orders marked as preparing. Notifications sent to customers.')
    mark_as_preparing.short_description = "Mark selected orders as preparing"
    
    def mark_as_ready(self, request, queryset):
        updated = queryset.update(status='ready')
        messages.success(request, f'{updated} orders marked as ready. Notifications sent to customers.')
    mark_as_ready.short_description = "Mark selected orders as ready"
    
    def mark_as_out_for_delivery(self, request, queryset):
        updated = queryset.update(status='out_for_delivery')
        messages.success(request, f'{updated} orders marked as out for delivery. Notifications sent to customers.')
    mark_as_out_for_delivery.short_description = "Mark selected orders as out for delivery"
    
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(status='delivered')
        messages.success(request, f'{updated} orders marked as delivered. Notifications sent to customers.')
    mark_as_delivered.short_description = "Mark selected orders as delivered"