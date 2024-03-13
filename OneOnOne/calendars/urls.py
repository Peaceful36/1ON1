from django.urls import include, path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    path('calendars/all/all/', view=views.getCalendars, name='getCalendars'),
    path('calendars/<int:cid>/', view=views.getOneCalendar, name='getOneCalendar'),
    path('calendars/create/', view=views.createCalendar, name='createCalendar'),
    path('calendars/<int:cid>/edit/',
         view=views.editCalendar, name='editCalendar'),
    path('calendars/<int:cid>/preferences',
         view=views.getPreferences, name='getPreferences'),

    # Temp paths
    #     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #     path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Meeting
    path('calendars/<int:cid>/meetings/all/',
         view=views.getAllMeetingCal, name='calendar_meeting_all'),
    path('calendars/<int:cid>/meeting/create/',
         view=views.createMeeting, name="meetingCreate"),
    path('calendars/<int:cid>/meeting/<int:mid>/',
         view=views.getMeeting, name="meetingViewID"),
    path('calendars/<int:cid>/meetings/all/',
         view=views.getAllMeetingCal, name='calendar_meeting_all'),
    path('calendars/<int:cid>/meeting/<int:mid>/edit/',
         view=views.editMeeting, name="meetingEdit"),
    path('calendars/<int:cid>/meeting/create/',
         view=views.createMeeting, name="meetingCreate"),
    path('calendars/<int:cid>/meeting/<int:mid>/edit/',
         view=views.editMeeting, name="meetingEdit"),
    path('calendars/<int:cid>/meeting/<int:mid>/',
         view=views.getMeeting, name="meetingViewID"),

    # Preference Endpoints
    path('calendars/<int:cid>/preferences/all/',
         view=views.getPreferences, name='getPreferences'),
    path('calendars/<int:cid>/preferences/<str:date>/',
         view=views.calendarsPreferencesDate, name='getPreferencesDate'),
    path('calendars/<int:cid>/preference/create/',
         view=views.createPreference, name="preferenceCreate"),
    path('calendars/<int:cid>/preference/<int:pid>/edit/',
         view=views.editPreference, name="preferenceEdit"),
    path('calendars/<int:cid>/preference/<int:pid>/',
         view=views.preferenceViewID, name="preferenceViewID"),

    path('calendars/<int:cid>/meeting/create',
         view=views.createMeeting, name="meetingCreate"),

    path('calendars/<int:cid>/meeting/<int:mid>',
         view=views.getMeeting, name="meetingViewID"),
    path('calendars/<int:cid>/meetings/all',
         view=views.getAllMeetingCal, name='calendar_meeting_all'),

    path('calendars/<int:cid>/meeting/<int:mid>/edit',
         view=views.editMeeting, name="meetingEdit"),


]
