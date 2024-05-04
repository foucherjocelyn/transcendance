# Generated by Django 5.0.4 on 2024-04-20 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendApi', '0006_remove_friendship_unique_friendship_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='channelbanneduser',
            name='bannedReason',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='channelmuteduser',
            name='mutedReason',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='banneduser',
            name='bannedReason',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='channelmessage',
            name='content',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='game',
            name='loserScore',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='game',
            name='status',
            field=models.CharField(choices=[('progressing', 'Progressing'), ('end', 'End')], default='progressing'),
        ),
        migrations.AlterField(
            model_name='game',
            name='winnerScore',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='gamescore',
            name='score',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='muteduser',
            name='mutedReason',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='avatarPath',
            field=models.CharField(blank=True, default=None, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='usermessage',
            name='content',
            field=models.TextField(blank=True, default=None, null=True),
        ),
    ]