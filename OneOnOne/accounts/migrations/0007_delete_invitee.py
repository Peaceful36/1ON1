# Generated by Django 5.0.3 on 2024-03-29 18:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_invitee'),
        ('calendars', '0011_invitee_alter_calendar_participants'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Invitee',
        ),
    ]