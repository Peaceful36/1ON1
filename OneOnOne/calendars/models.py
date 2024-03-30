from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class PriorityChoices(models.TextChoices):
    NONE = "None",
    HIGH = "High Priority",
    MED = "Medium Priority",
    LOW = "Low Priority",


class Preference(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    priority = models.CharField(
        max_length=50,
        choices=PriorityChoices,
        default=PriorityChoices.NONE,
    )


class StatusChoices(models.TextChoices):
    NO = "Not Accepted",
    YES = "Accepted",


class Invitee(models.Model):
    inviter = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="invitationOwner")
    invitee = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="invitationTo")
    status = models.CharField(
        max_length=50,
        choices=StatusChoices,
        default=StatusChoices.NO,
    )


class Calendar(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=250, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    participants = models.ManyToManyField(
        Invitee, related_name="invitees", blank=True)
    preferences = models.ManyToManyField(
        Preference, blank=True)
