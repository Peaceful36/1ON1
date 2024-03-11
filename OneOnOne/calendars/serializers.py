from calendars.models import Calendar, Meeting, Preference
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers


class CalendarSerializer(ModelSerializer):
    class Meta:
        model = Calendar
        fields = ['title', 'description',
                  'participants', 'preferences', 'meetings']

    def create(self, validated_data):
        # Add request.user as a participant if not provided in the request data
        participants_data = validated_data.get('participants', [])
        if not participants_data:
            participants_data.append(self.context['request'].user)

        # Call the parent class create method to create the Calendar instance
        return super().create(validated_data)


class MeetingSerializer(ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['user ', 'date', 'start_time', 'end_time', 'priority']


class PreferenceSerializer(ModelSerializer):
    class Meta:
        model = Preference
        fields = ['user ', 'date', 'start_time', 'end_time', 'priority']
