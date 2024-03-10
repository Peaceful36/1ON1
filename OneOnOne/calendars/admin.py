from django.contrib import admin
from calendars.models import Calendar, Meeting, Preference
# Register your models here.
admin.site.register(Calendar)
admin.site.register(Meeting)
admin.site.register(Preference)
