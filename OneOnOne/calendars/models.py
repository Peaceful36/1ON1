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


class Meeting(models.Model):
    user = models.ManyToManyField(User)
    # calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    date = models.DateField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    priority = models.CharField(
        max_length=50,
        choices=PriorityChoices,
        default=PriorityChoices.NONE,
        blank=True
    )


class Calendar(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=250, blank=True)
    participants = models.ManyToManyField(User)
    preferences = models.ManyToManyField(
        Preference, blank=True)
    meetings = models.ManyToManyField(
        Meeting, blank=True)
