from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from calendars.models import Calendar
from calendars.serializers import CalendarSerializer, PreferenceSerializer

# Create your views here.


@api_view(['GET'])
def getCalendars(request):
    calendars = Calendar.objects.all()
    serializer = CalendarSerializer(calendars, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def createCalendar(request):
    request.data['participants'] = [request.user.id]
    serializer = CalendarSerializer(
        data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getOneCalendar(request, cid):
    calendar = Calendar.objects.get(id=cid)
    serializer = CalendarSerializer(calendar)
    return Response(serializer.data)


@api_view(['PUT'])
def editCalendar(request, cid):
    calendar = Calendar.objects.get(id=cid)
    serializer = CalendarSerializer(calendar, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getPreferences(request, cid):
    calendar = Calendar.objects.get(id=cid)
    serializer = PreferenceSerializer(calendar.preferences, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
