# Generated by Django 5.0.4 on 2024-04-26 08:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendApi', '0011_alter_user_created_at_alter_user_updated_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tournament',
            name='end_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='start_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='user',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]