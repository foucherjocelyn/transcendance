# Generated by Django 5.0.4 on 2024-04-26 08:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendApi', '0010_alter_tournament_max_players_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='created_at',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='updated_at',
            field=models.DateField(auto_now=True),
        ),
    ]
