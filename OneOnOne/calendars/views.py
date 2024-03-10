from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from calendars.models import Calendar
from calendars.serializers import CalendarSerializer

# Create your views here.


@api_view(['GET'])
def getCalendars(request):
    calendars = Calendar.objects.all()
    serializer = CalendarSerializer(calendars, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def createCalendar(request):
    pass
