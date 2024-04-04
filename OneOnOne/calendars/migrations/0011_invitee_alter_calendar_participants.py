# Generated by Django 5.0.3 on 2024-03-29 18:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendars', '0010_remove_calendar_meetings_calendar_owner_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Invitee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Not Accepted', 'Not'), ('Accepted', 'Acc')], default='Not Accepted', max_length=50)),
                ('inviter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitationOwner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='calendar',
            name='participants',
            field=models.ManyToManyField(related_name='invitees', to='calendars.invitee'),
        ),
    ]
