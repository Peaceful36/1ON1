from django.contrib.auth.models import User
from django.db import models


class Contact(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='contacts')
    contact_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='contact_of')

    def __str__(self):
        return f"{self.user} - {self.contact_user.username}"


class UserProfile(models.Model):
    username = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='userprofile')
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField()
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.username

    # Add other fields as needed
