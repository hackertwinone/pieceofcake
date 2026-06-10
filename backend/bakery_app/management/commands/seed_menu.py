from django.core.management.base import BaseCommand
from bakery_app.models import Category, MenuItem

# All images: dark food photography from Unsplash
# Cropped to 800×600, auto-format, high quality
# Replace with actual product photos via Django admin when ready

BASE = "https://images.unsplash.com/"

MENU_DATA = [
    {
        "category": "Sweet Breads",
        "description": "Pan dulce baked in the old tradition — each piece a small dark miracle.",
        "items": [
            {
                "name": "Midnight Concha",
                "description": "A dense, dark chocolate concha dusted with cocoa sugar — the colour of a moonless sky.",
                "ingredients": "Flour, dark cocoa, butter, sugar, yeast, eggs",
                "allergens": "Gluten, Dairy, Eggs",
                "price": "3.50",
                "image_url": BASE + "photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85",
            },
            {
                "name": "Gilded Oreja",
                "description": "Puff pastry folded into the shape of an ear, caramelised to a deep amber. Crisp, rich, unrelenting.",
                "ingredients": "Puff pastry, cane sugar, butter",
                "allergens": "Gluten, Dairy",
                "price": "3.25",
                "image_url": BASE + "photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=85",
            },
            {
                "name": "Raven's Crescent",
                "description": "A buttery cuernito brushed with black sesame glaze — soft within, darkly lustrous without.",
                "ingredients": "Flour, butter, sugar, black sesame, yeast",
                "allergens": "Gluten, Dairy, Sesame",
                "price": "3.50",
                "image_url": BASE + "photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=85",
            },
            {
                "name": "Campechana Sombría",
                "description": "Half puff, half sweet dough — a pastry of two natures, glazed with burnt sugar and quiet menace.",
                "ingredients": "Puff pastry, sweet dough, piloncillo glaze",
                "allergens": "Gluten, Dairy",
                "price": "3.75",
                "image_url": BASE + "photo-1549931319-a545dcf3bc7c?auto=format&fit=crop&w=800&q=85",
            },
            {
                "name": "Polvorón de las Sombras",
                "description": "A crumbling shortbread dusted with powdered sugar and a whisper of cinnamon. It dissolves like a secret.",
                "ingredients": "Flour, lard, powdered sugar, cinnamon, vanilla",
                "allergens": "Gluten",
                "price": "2.75",
                "image_url": BASE + "photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=85",
            },
            {
                "name": "Pan de Polvo",
                "description": "Anise-scented shortbread rolled in cinnamon sugar — delicate, ceremonial, ancient.",
                "ingredients": "Flour, lard, anise, cinnamon, powdered sugar",
                "allergens": "Gluten",
                "price": "2.75",
                "image_url": BASE + "photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=800&q=85",
            },
        ],
    },
    {
        "category": "Cakes & Tortes",
        "description": "Whole cakes and individual slices — each one a statement, not a suggestion.",
        "items": [
            {
                "name": "Midnight Velvet Torte",
                "description": "A dense chocolate torte draped in midnight ganache. Not for the faint of heart — or the sweet of tooth.",
                "ingredients": "Dark chocolate, butter, eggs, sugar, cream",
                "allergens": "Gluten, Dairy, Eggs",
                "price": "7.50",
                "image_url": BASE + "photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85",
            },
            {
                "name": "Tres Leches de Media Noche",
                "description": "Three milks soaked into a pale sponge, topped with cold whipped cream. Indulgent to the point of confession.",
                "ingredients": "Sponge cake, whole milk, condensed milk, evaporated milk, heavy cream",
                "allergens": "Gluten, Dairy, Eggs",
                "price": "6.50",
                "image_url": BASE + "photo-1562440499-64a9a111f927?auto=format&fit=crop&w=800&q=85",
            },
            {
                "name": "Blood Orange Tarta",
                "description": "A sharp, jewel-toned tart of blood orange curd in a dark butter pastry shell. Beautiful in the way that warnings are.",
                "ingredients": "Blood orange, eggs, butter, sugar, pastry shell",
                "allergens": "Gluten, Dairy, Eggs",
                "price": "7.00",
                "image_url": BASE + "photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=800&q=85",
            },
            {
                "name": "Bitter Cherry Gâteau",
                "description": "Layers of dark chocolate sponge and sour cherry compote, sealed under a coat of black cherry glaze.",
                "ingredients": "Dark chocolate sponge, sour cherries, kirsch, dark chocolate glaze",
                "allergens": "Gluten, Dairy, Eggs",
                "price": "7.50",
                "image_url": BASE + "photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=85",
            },
            {
                "name": "Spiced Raven Cake",
                "description": "A molasses and cardamom cake with a black treacle drizzle. Warmth buried in darkness.",
                "ingredients": "Flour, molasses, cardamom, black treacle, butter, eggs",
                "allergens": "Gluten, Dairy, Eggs",
                "price": "6.50",
                "image_url": BASE + "photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=85",
            },
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the database with Mario's Piece of Cake bakery menu"

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
                        "allergens": item_data.get("allergens", ""),
                        "price": item_data["price"],
                        "image_url": item_data.get("image_url", ""),
                        "category": category,
                        "is_available": True,
                    },
                )
                self.stdout.write(f"    {'Created' if created else 'Already exists'}: {item.name}")

        self.stdout.write(self.style.SUCCESS("\nBakery menu seeded successfully."))
