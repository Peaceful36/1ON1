from calendars.models import Calendar, Invitee, Preference
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers


class CalendarSerializer(ModelSerializer):
    class Meta:
        model = Calendar
        fields = ['id', 'owner', 'title', 'description',
                  'start_date', 'end_date', 'participants', 'preferences', ]


class PreferenceSerializer(ModelSerializer):
    class Meta:
        model = Preference
        fields = ['id', 'user', 'date', 'start_time',
                  'end_time', 'priority']


class InviteeSerializer(ModelSerializer):
    class Meta:
        model = Invitee
        fields = ['id', 'inviter', 'invitee', 'status']
