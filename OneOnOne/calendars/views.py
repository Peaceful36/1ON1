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
            requestUser.id] + request.data.get("participants", [])
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


@api_view(['DELETE'])
def deleteCalendar(request, cid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        calendar.delete()
        return Response({}, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def createMeeting(request, cid):

    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        request.data['calendar'] = calendar.id
        request.data['user'] = [request.user.id] + request.data.get("user", [])

        for usert in request.data['user']:
            # print(usert, calendar.participants.all(), calendar.participants.filter(id=usert))
            if not calendar.participants.filter(id=usert):
                return Response({"error": "User not in Calendar"}, status=status.HTTP_404_NOT_FOUND)

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
        try:
            meeting = calendar.meetings.get(id=mid)
        except:
            return Response({"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = MeetingSerializer(meeting)
        return Response(serializer.data)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def getAllMeetingCal(request, cid):
    # Get the calendar instance or return 404 if it does not exist
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()

        if not calendar:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve all meetings associated with the calendar
        meetings = calendar.meetings.filter(user=requestUser)

        if not meetings:
            return Response({"error": "User not found in Meeting"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the meetings and return the response
        serializer = MeetingSerializer(meetings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PUT'])
def editMeeting(request, cid, mid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            meeting = calendar.meetings.get(id=mid)
        except:
            return Response({"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND)

        for usert in request.data['user']:
            # print(usert, calendar.participants.all(), calendar.participants.filter(id=usert))
            if not calendar.participants.filter(id=usert):
                return Response({"error": "User not in Calendar"}, status=status.HTTP_404_NOT_FOUND)

        serializer = MeetingSerializer(
            meeting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def deleteMeeting(request, cid, mid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        meeting = calendar.meetings.filter(user=requestUser, id=mid).first()
        if not meeting:
            return Response({"error": "Meeting Not Found"}, status=status.HTTP_404_NOT_FOUND)
        meeting.delete()
        return Response({}, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


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
        return Response({'error': 'Calendar does not exist'}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def createPreference(request, cid):
    jwtAuth = JWTAuthentication()
    isAuthenticated = jwtAuth.authenticate(request)
    if not isAuthenticated:
        return Response({'error': 'Authentication credentials not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    current_user = isAuthenticated[0]
    request.data['user'] = current_user.id
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
    current_user = isAuthenticated[0]
    request.data['user'] = current_user.id
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
        calendar = Calendar.objects.get(
            id=cid, participants=isAuthenticated[0])
    except Calendar.DoesNotExist:
        raise Http404("Calendar does not exist")

    preference = calendar.preferences.get_object_or_404(id=pid)
    serializer = PreferenceSerializer(preference)
    return Response(serializer.data, status=status.HTTP_200_OK)
    # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def calendarsPreferencesDate(request, cid, date):
    jwtAuth = JWTAuthentication()
    isAuthenticated = jwtAuth.authenticate(request)
    if not isAuthenticated:
        return Response({'error': 'Authentication credentials not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        calendar = Calendar.objects.get(
            id=cid, participants=isAuthenticated[0])
    except Calendar.DoesNotExist:
        raise Http404("Calendar does not exist")
    preferences = calendar.preferences.filter(date=date)
    serializer = PreferenceSerializer(preferences, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def deletePreference(request, cid, pid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = Calendar.objects.filter(
            id=cid, participants=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        preference = calendar.preferences.filter(id=pid, user=requestUser)
        if not preference:
            return Response({"error": "Preference Not Found"}, status=status.HTTP_404_NOT_FOUND)
        preference.delete()
        return Response({}, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
