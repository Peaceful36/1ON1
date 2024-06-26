from django.urls import include, path
from . import views


urlpatterns = [
    # Calendar Endpoint
    path('calendars/all/', view=views.getCalendars, name='getCalendars'),
    path('calendars/<int:cid>/', view=views.getOneCalendar, name='getOneCalendar'),
    path('calendars/create/', view=views.createCalendar, name='createCalendar'),
    path('calendars/<int:cid>/edit/',
         view=views.editCalendar, name='editCalendar'),
    path('calendars/<int:cid>/delete/',
         view=views.deleteCalendar, name='deleteCalendar'),
    path('calendars/<int:cid>/participants/',
         view=views.getParticipants, name='getParticipants'),
    path('calendars/<int:cid>/generate/',
         view=views.generateSchedule, name="autoGenerate"),

    # Invite stuff
    path('calendars/<int:cid>/invite/', view=views.inviteUser, name='inviteUser'),
    path('calendars/<int:cid>/invite/<int:uid>/delete/',
         view=views.removeInvite, name='removeInvite'),
    path('calendars/<int:cid>/invite/<int:uid>/status/',
         view=views.inviteUserStatus, name='inviteStatus'),
    path('calendars/<int:cid>/invite/<int:uid>/status/update/',
         view=views.inviteUserStatusUpdate, name='inviteStatusUpdate'),
    path('calendars/<int:uid>/invitations/all/',
         view=views.allInvitations, name='allInvitations'),

    # Preference Endpoints
    path('calendars/<int:cid>/preferences/all/',  # todo
         view=views.getPreferences, name='getPreferences'),
    # Preference Endpoints
    path('calendars/<int:cid>/preferences/<int:uid>/all/',  # todo
         view=views.getPreferencesByUID, name='getPreferencesByUID'),
    path('calendars/<int:cid>/preferences/<str:date>/',
         view=views.calendarsPreferencesDate, name='getPreferencesDate'),
    path('calendars/<int:cid>/preference/create/',
         view=views.createPreference, name="preferenceCreate"),
    path('calendars/<int:cid>/preference/<int:pid>/edit/',
         view=views.editPreference, name="preferenceEdit"),
    path('calendars/<int:cid>/preference/<int:pid>/',
         view=views.preferenceViewID, name="preferenceViewID"),
    path('calendars/<int:cid>/preference/<int:pid>/delete/',
         view=views.deletePreference, name="deletePreference"),
]
