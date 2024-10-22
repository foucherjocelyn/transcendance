# Generated by Django 5.0.6 on 2024-05-29 09:48

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendApi', '0004_tournament_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='champion',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tournament_champion', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='user',
            name='id42',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='status',
            field=models.CharField(choices=[('registering', 'Registering'), ('progressing', 'Progressing'), ('finished', 'Finished')], default='registering', max_length=20),
        ),
    ]
