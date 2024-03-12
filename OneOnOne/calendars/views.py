from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from calendars.models import Calendar, Meeting
from calendars.serializers import CalendarSerializer, MeetingSerializer, PreferenceSerializer

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


@api_view(['POST'])
def createMeeting(request, cid):
    # Ensure user is authenticated
    # if not request.user.is_authenticated:
    #     return Response({'error': 'Authentication credentials not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Get the calendar instance or return 404 if it does not exist
    calendar = get_object_or_404(Calendar, id=cid)
    request.data['calendar'] = calendar.id
    request.data['participants'] = [request.user.id]
    serializer = MeetingSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        meeting = serializer.save()
        calendar.meetings.add(meeting)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getMeeting(request, cid, mid):
    meeting = get_object_or_404(Meeting, id=mid)
    serializer = MeetingSerializer(meeting)
    return Response(serializer.data)

@api_view(['GET'])
def getAllMeetingCal(request, cid):
    # Get the calendar instance or return 404 if it does not exist
    calendar = get_object_or_404(Calendar, id=cid)

    # Retrieve all meetings associated with the calendar
    meetings = calendar.meetings.all()

    # Serialize the meetings and return the response
    serializer = MeetingSerializer(meetings, many=True)
    return Response(serializer.data)
