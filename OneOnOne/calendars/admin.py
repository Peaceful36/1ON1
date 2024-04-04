from django.contrib import admin
from calendars.models import Calendar, Preference, Invitee
# Register your models here.
admin.site.register(Calendar)
admin.site.register(Preference)
admin.site.register(Invitee)
