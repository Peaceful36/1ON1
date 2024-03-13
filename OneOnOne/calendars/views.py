from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from calendars.models import Calendar, Meeting, Preference
from calendars.serializers import CalendarSerializer, MeetingSerializer, PreferenceSerializer
from django.http import Http404
from rest_framework_simplejwt.authentication import JWTAuthentication

jwtAuth = JWTAuthentication()


@api_view(['GET'])
def getCalendars(request):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        # Request User
        requestUser = isAuthenticated[0]
        # Get calendars with request user
        calendars = Calendar.objects.filter(participants=requestUser)
        # Serialize
        serializer = CalendarSerializer(calendars, many=True)
        # Response
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def createCalendar(request):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        # Request User
        requestUser = isAuthenticated[0]
        request.data['participants'] = [
            requestUser.id] + request.data['participants']
        serializer = CalendarSerializer(
            data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def getOneCalendar(request, cid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CalendarSerializer(calendar)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PUT'])
def editCalendar(request, cid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CalendarSerializer(
            calendar, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def createMeeting(request, cid):
    # Ensure user is authenticated
    # if not request.user.is_authenticated:
    #     return Response({'error': 'Authentication credentials not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Get the calendar instance or return 404 if it does not exist
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        request.data['calendar'] = calendar.id
        request.data['user'] = [request.user.id]
        serializer = MeetingSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            meeting = serializer.save()
            calendar.meetings.add(meeting)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def getMeeting(request, cid, mid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        meeting = calendar.meetings.get(id=mid)

        serializer = MeetingSerializer(meeting)
        return Response(serializer.data)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def getAllMeetingCal(request, cid):
    # Get the calendar instance or return 404 if it does not exist
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        calendar = get_object_or_404(Calendar, id=cid)

        # Retrieve all meetings associated with the calendar
        meetings = calendar.meetings.all()

        # Serialize the meetings and return the response
        serializer = MeetingSerializer(meetings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PUT'])
def editMeeting(request, cid, mid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        try:
            calendar = Calendar.objects.get(id=cid)
            meeting = calendar.meetings.get(id=mid)
        except Calendar.DoesNotExist:
            raise Http404("Calendar does not exist")
        except Meeting.DoesNotExist:
            raise Http404("Meeting does not exist")
        serializer = MeetingSerializer(
            meeting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getPreferences(request, cid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if calendar:
            serializer = PreferenceSerializer(calendar.preferences, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def createPreference(request, cid):
    jwtAuth = JWTAuthentication()
    isAuthenticated = jwtAuth.authenticate(request)
    if not isAuthenticated:
        return Response({'error': 'Authentication credentials not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    current_user = isAuthenticated[0]
    calendar = get_object_or_404(Calendar, id=cid, participants=current_user)
    if not calendar:
        return Response({'error': 'Calendar does not exist'}, status=status.HTTP_404_NOT_FOUND)
    request.data['calendar'] = calendar.id
    serializer = PreferenceSerializer(data=request.data)
    if serializer.is_valid():
        preference = serializer.save()
        calendar.preferences.add(preference)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def editPreference(request, cid, pid):
    jwtAuth = JWTAuthentication()
    isAuthenticated = jwtAuth.authenticate(request)
    if not isAuthenticated:
        return Response({'error': 'Authentication credentials not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        currnet_user = isAuthenticated[0]
        calendar = Calendar.objects.get(id=cid, participants=currnet_user)       
        preference = calendar.preferences.get(id=pid)
    except Calendar.DoesNotExist:
        raise Http404("Calendar does not exist")
    except Preference.DoesNotExist:
        raise Http404("Preference does not exist")
    serializer = PreferenceSerializer(
        preference, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def preferenceViewID(request, cid, pid):
    jwtAuth = JWTAuthentication()
    isAuthenticated = jwtAuth.authenticate(request)
    if not isAuthenticated:
        return Response({'error': 'Authentication credentials not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        calendar = Calendar.objects.get(id=cid, participants=isAuthenticated[0]) 
    except Calendar.DoesNotExist:
        raise Http404("Calendar does not exist")
    preference = calendar.preferences.get(id=pid)
    serializer = PreferenceSerializer(preference)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def calendarsPreferencesDate(request, cid):
    jwtAuth = JWTAuthentication()
    isAuthenticated = jwtAuth.authenticate(request)
    if not isAuthenticated:
        return Response({'error': 'Authentication credentials not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        calendar = Calendar.objects.get(id=cid, participants=isAuthenticated[0])
    except Calendar.DoesNotExist:
        raise Http404("Calendar does not exist")
    date = request.GET.get('date')
    preferences = calendar.preferences.filter(date=date)
    serializer = PreferenceSerializer(preferences, many=True)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
