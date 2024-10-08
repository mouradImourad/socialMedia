# Generated by Django 5.1 on 2024-08-16 03:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_is_staff_user_is_superuser'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfileVisit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visited_at', models.DateTimeField(auto_now_add=True)),
                ('profile_owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visits_received', to=settings.AUTH_USER_MODEL)),
                ('visitor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visits_made', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
