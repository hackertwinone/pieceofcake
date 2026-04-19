from django.core.management.base import BaseCommand
from restaurant.models import Category, MenuItem


MENU_DATA = [
    {
        "category": "Lattes",
        "description": "Espresso-based drinks crafted with house syrups and fresh milk",
        "items": [
            {
                "name": "Salted Honey Latte",
                "description": "A warm, comforting latte sweetened with golden honey and finished with a pinch of sea salt.",
                "ingredients": "Espresso, steamed milk, honey, sea salt",
                "price": "6.50",
            },
            {
                "name": "Brown Sugar Bliss",
                "description": "Rich brown sugar syrup and a touch of cinnamon over smooth espresso and silky milk.",
                "ingredients": "Espresso, steamed milk, brown sugar syrup, cinnamon",
                "price": "6.50",
            },
            {
                "name": "Mazapán Latte",
                "description": "Inspired by the classic Mexican candy — sweet peanut and vanilla come together in every sip.",
                "ingredients": "Espresso, steamed milk, peanut syrup, vanilla",
                "price": "6.75",
            },
            {
                "name": "Club Spanish Latte",
                "description": "Our signature take on the Spanish latte — bold espresso sweetened with velvety condensed milk.",
                "ingredients": "Espresso, steamed milk, condensed milk",
                "price": "6.75",
            },
            {
                "name": "Pink Cloud Latte",
                "description": "Light vanilla espresso topped with a dreamy strawberry foam — as pretty as it is delicious.",
                "ingredients": "Espresso, steamed milk, vanilla syrup, strawberry foam",
                "price": "7.00",
            },
            {
                "name": "Ferrero Latte",
                "description": "A decadent blend of hazelnut and chocolate that tastes like your favorite chocolate truffle.",
                "ingredients": "Espresso, steamed milk, hazelnut syrup, chocolate sauce",
                "price": "7.00",
            },
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the database with The Cafecito Club menu data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear all existing categories and menu items before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            MenuItem.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write(self.style.WARNING("Cleared existing menu data."))

        for section in MENU_DATA:
            category, created = Category.objects.get_or_create(
                name=section["category"],
                defaults={"description": section["description"]},
            )
            if created:
                self.stdout.write(f"  Created category: {category.name}")
            else:
                self.stdout.write(f"  Category already exists: {category.name}")

            for item_data in section["items"]:
                item, created = MenuItem.objects.get_or_create(
                    name=item_data["name"],
                    defaults={
                        "description": item_data["description"],
                        "ingredients": item_data["ingredients"],
                        "price": item_data["price"],
                        "category": category,
                        "is_available": True,
                    },
                )
                status = "Created" if created else "Already exists"
                self.stdout.write(f"    {status}: {item.name}")

        self.stdout.write(self.style.SUCCESS("\nMenu seeded successfully!"))
