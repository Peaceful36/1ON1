from collections import defaultdict
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from calendars.models import Calendar, Preference, Invitee
from calendars.serializers import CalendarSerializer, PreferenceSerializer, InviteeSerializer
from accounts.serializers import UserDetailsSerializer
from django.http import Http404
from django.core.serializers import serialize
from rest_framework_simplejwt.authentication import JWTAuthentication

jwtAuth = JWTAuthentication()


def getCalendarsByRequestUser(requestUser):
    invitees = Invitee.objects.filter(invitee=requestUser)
    # Extract the ids of calendars where the requestUser is an invitee
    calendar_ids = invitees.values_list('calendar_id', flat=True)
    # Get calendars with request user
    participant_calendars = Calendar.objects.filter(
        id__in=calendar_ids)
    owner_calendars = Calendar.objects.filter(owner=requestUser)
    calendars = participant_calendars | owner_calendars
    return calendars.distinct()


def getOneCalendarByRequestUser(requestUser, cid):
    invitees = Invitee.objects.filter(invitee=requestUser)
    # Extract the ids of calendars where the requestUser is an invitee
    calendar_ids = invitees.values_list('calendar_id', flat=True)

    if cid:
        owner_calendars = Calendar.objects.filter(
            id=cid, owner=requestUser).first()
        if cid in calendar_ids and not owner_calendars:
            return Calendar.objects.filter(id=cid).first()
        return owner_calendars

    # Get calendars with request user
    participant_calendars = Calendar.objects.filter(
        id__in=calendar_ids).first()
    owner_calendars = Calendar.objects.filter(owner=requestUser).first()
    calendar = participant_calendars if participant_calendars else owner_calendars
    return calendar


@api_view(['GET'])
def getCalendars(request):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        # Request User
        requestUser = isAuthenticated[0]
        calendars = getCalendarsByRequestUser(requestUser)
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
        request.data['owner'] = requestUser.id
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
        calendar = getOneCalendarByRequestUser(requestUser, cid)
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
        calendar = getOneCalendarByRequestUser(requestUser)
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
            id=cid, owner=requestUser).first()
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        calendar.delete()
        return Response({}, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def inviteUser(request, cid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = getOneCalendarByRequestUser(requestUser, cid)
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)

        inviteeExists = calendar.participants.filter(
            invitee=request.data.get("invitee", None)).first()

        if inviteeExists:
            return Response(inviteeSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

        request.data["inviter"] = requestUser.id
        request.data["calendar_id"] = cid

        inviteeSerializer = InviteeSerializer(data=request.data)
        if inviteeSerializer.is_valid():
            invitee = inviteeSerializer.save()
            calendar.participants.add(invitee)
            calendarSerializer = CalendarSerializer(calendar)
            return Response(calendarSerializer.data, status=status.HTTP_201_CREATED)
        return Response(inviteeSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['DELETE'])
def removeInvite(request, cid, uid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = getOneCalendarByRequestUser(requestUser, cid)
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        invitee = calendar.participants.filter(invitee=uid).first()
        if not invitee:
            invitee = calendar.participants.filter(id=uid).first()
            if not invitee:
                return Response({"error": "Invitee Not Found"}, status=status.HTTP_404_NOT_FOUND)
        invitee.delete()
        return Response({}, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def inviteUserStatus(request, cid, uid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = getOneCalendarByRequestUser(requestUser, cid)
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        invitee = calendar.participants.filter(invitee=uid).first()
        if not invitee:
            return Response({"error": "Invitee Not Found"}, status=status.HTTP_404_NOT_FOUND)
        inviteeSerializer = InviteeSerializer(invitee)
        return Response(inviteeSerializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def inviteUserStatusUpdate(request, cid, uid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = getOneCalendarByRequestUser(
            User.objects.filter(id=uid).first(), cid)
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        invitee = calendar.participants.filter(invitee=uid).first()
        if not invitee:
            return Response({"error": "Invitee Not Found"}, status=status.HTTP_404_NOT_FOUND)
        inviteeSerializer = InviteeSerializer(
            invitee, data=request.data, partial=True)
        if inviteeSerializer.is_valid():
            inviteeSerializer.save()
            return Response(inviteeSerializer.data, status=status.HTTP_200_OK)
        return Response(inviteeSerializer.data, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def allInvitations(request, uid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        invitee = Invitee.objects.filter(invitee=uid)
        if not invitee:
            return Response({}, status=status.HTTP_200_OK)
        inviteeSerializer = InviteeSerializer(invitee, many=True)
        return Response(inviteeSerializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def getParticipants(request, cid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = getOneCalendarByRequestUser(requestUser, cid)
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        participants = []
        participants.append(calendar.owner.id)
        for participant in calendar.participants.all():
            participants.append(participant.invitee.id)
        users_queryset = User.objects.filter(pk__in=participants)
        serialized_users = UserDetailsSerializer(users_queryset, many=True)
        return Response(serialized_users.data, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def generateSchedule(request, cid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = getOneCalendarByRequestUser(requestUser, cid)
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)

        datetime_objects = []

        for preference in calendar.preferences.all():
            datetime_objects.append(
                {'date': preference.date, 'start_time': preference.start_time,
                 'end_time': preference.end_time, 'preference': preference.priority})
        if not datetime_objects:
            return Response({"Error": "No Preferences"}, status=status.HTTP_404_NOT_FOUND)
        # Assign preference levels
        preference_levels = {'Low Priority': 1,
                             'Medium Priority': 2, 'High Priority': 3}

        # Create a dictionary to store total preference levels and counts for each time slot
        time_slot_preferences = defaultdict(
            lambda: {'total_preference': 0, 'count': 0})
        # Iterate through datetime objects and calculate total preference levels and counts for each time slot
        for obj in datetime_objects:
            date = obj['date']
            start_time = obj['start_time']
            end_time = obj['end_time']
            preference = preference_levels[obj['preference']]

            # Combine date, start time, and end time to create a unique time slot identifier
            time_slot = f"{date} {start_time}-{end_time}"

            time_slot_preferences[time_slot]['total_preference'] += preference
            time_slot_preferences[time_slot]['count'] += 1

        # Calculate average preference level for each time slot
        for time_slot, values in time_slot_preferences.items():
            if values['count'] > 0:
                average_preference = values['total_preference'] / \
                    values['count']
                time_slot_preferences[time_slot]['average_preference'] = average_preference
            else:
                time_slot_preferences[time_slot]['average_preference'] = 0
        # Find the time slot with the highest average preference level
        best_time_slot = max(time_slot_preferences.items(),
                             key=lambda x: x[1]['average_preference'])
        return Response({'result': best_time_slot}, status=status.HTTP_200_OK)

    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def getPreferences(request, cid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        calendar = getOneCalendarByRequestUser(requestUser, cid)
        if not calendar:
            calendar = Calendar.objects.filter(
                id=cid, participants=requestUser).first()
        if calendar:
            serializer = PreferenceSerializer(calendar.preferences, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Calendar does not exist'}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def getPreferencesByUID(request, cid, uid):
    isAuthenticated = jwtAuth.authenticate(request)
    if isAuthenticated:
        requestUser = isAuthenticated[0]
        user = User.objects.filter(id=uid).first()
        if not user:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        calendar = getOneCalendarByRequestUser(user, cid)
        if calendar:
            preferences = calendar.preferences.filter(user=user)
            if preferences:
                serializer = PreferenceSerializer(preferences, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Calendar does not exist'}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def createPreference(request, cid):
    jwtAuth = JWTAuthentication()
    isAuthenticated = jwtAuth.authenticate(request)
    if not isAuthenticated:
        return Response({'error': 'Authentication credentials not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    requestUser = isAuthenticated[0]
    request.data['user'] = requestUser.id
    request.data['calendar_id'] = cid
    calendar = getOneCalendarByRequestUser(requestUser, cid)
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
        requestUser = isAuthenticated[0]
        calendar = getOneCalendarByRequestUser(requestUser, cid)
        if not calendar:
            return Response({'error': 'Calendar does not exist'}, status=status.HTTP_404_NOT_FOUND)
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
    calendar = getOneCalendarByRequestUser(isAuthenticated[0], cid)
    if not calendar:
        return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)

    preference = calendar.preferences.filter(id=pid).first()
    if not preference:
        return Response({"error": "Preference Not Found"}, status=status.HTTP_404_NOT_FOUND)
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
        calendar = getOneCalendarByRequestUser(isAuthenticated[0], cid)
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
        calendar = getOneCalendarByRequestUser(requestUser, cid)
        if not calendar:
            return Response({"error": "Calendar Not Found"}, status=status.HTTP_404_NOT_FOUND)
        preference = calendar.preferences.filter(id=pid, user=requestUser)
        if not preference:
            return Response({"error": "Preference Not Found"}, status=status.HTTP_404_NOT_FOUND)
        preference.delete()
        return Response({}, status=status.HTTP_200_OK)
    return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
