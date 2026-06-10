from django.apps import AppConfig

class RestaurantConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bakery_app'

    def ready(self):
        import bakery_app.signals  # Import signals when app is ready