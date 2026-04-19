from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from restaurant.models import MenuItem, Order, OrderItem


SAMPLE_ORDERS = [
    {
        "customer_name": "Maria G.",
        "customer_email": "maria@example.com",
        "customer_phone": "5551001001",
        "delivery_address": "",
        "special_instructions": "",
        "payment_method": "cash",
        "payment_status": "pending",
        "status": "pending",
        "minutes_ago": 7,
        "items": [
            {"name": "Salted Honey Latte", "quantity": 1, "size": "16 oz", "milk": "Oat"},
            {"name": "Brown Sugar Bliss", "quantity": 1, "size": "20 oz", "milk": "Almond"},
        ],
    },
    {
        "customer_name": "Carlos R.",
        "customer_email": "carlos@example.com",
        "customer_phone": "5551002002",
        "delivery_address": "123 Main St",
        "special_instructions": "Extra hot please",
        "payment_method": "paypal",
        "payment_status": "completed",
        "status": "preparing",
        "minutes_ago": 4,
        "items": [
            {"name": "Ferrero Latte", "quantity": 2, "size": "20 oz", "milk": "Whole"},
        ],
    },
    {
        "customer_name": "Sofia L.",
        "customer_email": "sofia@example.com",
        "customer_phone": "5551003003",
        "delivery_address": "",
        "special_instructions": "",
        "payment_method": "cash",
        "payment_status": "pending",
        "status": "pending",
        "minutes_ago": 2,
        "items": [
            {"name": "Pink Cloud Latte", "quantity": 1, "size": "16 oz", "milk": "Coconut"},
            {"name": "Mazapán Latte", "quantity": 1, "size": "16 oz", "milk": "2%"},
        ],
    },
    {
        "customer_name": "Diego M.",
        "customer_email": "diego@example.com",
        "customer_phone": "5551004004",
        "delivery_address": "456 Oak Ave",
        "special_instructions": "No sugar",
        "payment_method": "paypal",
        "payment_status": "completed",
        "status": "ready",
        "minutes_ago": 1,
        "items": [
            {"name": "Club Spanish Latte", "quantity": 3, "size": "20 oz", "milk": "Whole"},
        ],
    },
    {
        "customer_name": "Ana P.",
        "customer_email": "ana@example.com",
        "customer_phone": "5551005005",
        "delivery_address": "",
        "special_instructions": "Light ice",
        "payment_method": "cash",
        "payment_status": "pending",
        "status": "pending",
        "minutes_ago": 1,
        "items": [
            {"name": "Brown Sugar Bliss", "quantity": 1, "size": "16 oz", "milk": "Oat"},
            {"name": "Ferrero Latte", "quantity": 1, "size": "20 oz", "milk": "Almond"},
        ],
    },
]


class Command(BaseCommand):
    help = "Seed sample orders for KDS testing"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing orders before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            Order.objects.all().delete()
            self.stdout.write(self.style.WARNING("Cleared existing orders."))

        menu_items = {item.name: item for item in MenuItem.objects.all()}
        if not menu_items:
            self.stdout.write(self.style.ERROR(
                "No menu items found. Run 'python manage.py seed_menu' first."
            ))
            return

        for data in SAMPLE_ORDERS:
            created_at = timezone.now() - timedelta(minutes=data["minutes_ago"])

            total = sum(
                (6.50 if item["size"] == "16 oz" else 7.50) * item["quantity"]
                for item in data["items"]
            )

            order = Order.objects.create(
                customer_name=data["customer_name"],
                customer_email=data["customer_email"],
                customer_phone=data["customer_phone"],
                delivery_address=data["delivery_address"],
                special_instructions=data["special_instructions"],
                payment_method=data["payment_method"],
                payment_status=data["payment_status"],
                status=data["status"],
                total_amount=total,
            )
            # Back-date created_at after creation (auto_now_add prevents setting it directly)
            Order.objects.filter(pk=order.pk).update(created_at=created_at)

            for item_data in data["items"]:
                menu_item = menu_items.get(item_data["name"])
                if not menu_item:
                    self.stdout.write(self.style.WARNING(
                        f"  Menu item not found: {item_data['name']}, skipping"
                    ))
                    continue
                price = 6.50 if item_data["size"] == "16 oz" else 7.50
                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    quantity=item_data["quantity"],
                    price=price,
                    size=item_data["size"],
                    milk=item_data["milk"],
                )

            self.stdout.write(
                f"  Created order #{order.id} for {data['customer_name']} "
                f"({data['status']}, {data['minutes_ago']}m ago)"
            )

        self.stdout.write(self.style.SUCCESS("\nSample orders seeded successfully!"))
