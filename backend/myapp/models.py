from django.db import models


class UserProfile(models.Model):
    user_id: models.CharField = models.CharField(
        max_length=255, unique=True
    )  # Stores Cognito User ID
    email: models.EmailField = models.EmailField(unique=True)
    role: models.CharField = models.CharField(
        max_length=20,
        choices=[("buyer", "Buyer"), ("seller", "Seller"), ("admin", "Admin")],
    )
