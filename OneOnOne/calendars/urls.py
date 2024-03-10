from django.urls import include, path
from . import views

urlpatterns = [
    path('calendars/', view=views.getCalendars, name='getCalendars'),
    path('calendars/create', view=views.createCalendar, name='createCalendar'),
]
