from calendars.models import Calendar, Meeting, Preference
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers


class CalendarSerializer(ModelSerializer):
    class Meta:
        model = Calendar
        fields = ['title', 'description',
                  'participants', 'preferences', 'meetings']


class MeetingSerializer(ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['user ', 'date', 'start_time', 'end_time', 'priority']


class PreferenceSerializer(ModelSerializer):
    class Meta:
        model = Preference
        fields = ['user ', 'date', 'start_time', 'end_time', 'priority']
