from django.urls import include, path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    path('calendars/', view=views.getCalendars, name='getCalendars'),
    path('calendars/<int:cid>/', view=views.getOneCalendar, name='getOneCalendar'),
    path('calendars/create/', view=views.createCalendar, name='createCalendar'),
    path('calendars/<int:cid>/edit/',
         view=views.editCalendar, name='editCalendar'),
    path('calendars/<int:cid>/preferences',
         view=views.getPreferences, name='getPreferences'),

    # Temp paths
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # path('calendars/<int:cid>/meetings/all',
    #      view=views, name='calendar_meeting_all'),
    # path('calendars/<int:cid>/preferences/date',
    #      view=views, name='calendarsPreferencesDate'),
    # path('calendars/<int:cid>/meeting/create',
    #      view=views, name="meetingCreate"),
    # path('calendars/<int:cid>/meeting/<int:mid>/edit',
    #      view=views, name="meetingEdit"),
    # path('calendars/<int:cid>/meeting/<int:mid>',
    #      view=views, name="meetingViewID"),
    # path('calendars/<int:cid>/preference/create',
    #      view=views, name="preferenceCreate"),
    # path('calendars/<int:cid>/preference/<int:pid>/edit',
    #      view=views, name="preferenceEdit"),
    # path('calendars/<int:cid>/preference/<int:pid>',
    #      view=views, name="preferenceViewID"),
    

    path('calendars/<int:cid>/meeting/create',
         view=views.createMeeting, name="meetingCreate"),
    
    path('calendars/<int:cid>/meeting/<int:mid>',
         view=views.getMeeting, name="meetingViewID"),
    # path('calendars/<int:cid>/meeting/<int:mid>/edit',
    #      view=views, name="meetingEdit"),
    path('calendars/<int:cid>/meetings/all',
         view=views.getAllMeetingCal, name='calendar_meeting_all'),

]
