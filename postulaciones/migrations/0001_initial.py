# Generated by Django 5.2 on 2025-04-11 20:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Postulacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_postulacion', models.DateTimeField(auto_now_add=True)),
                ('estado', models.CharField(choices=[('en revision', 'En revisión'), ('descartado', 'Descartado'), ('seleccionado', 'Seleccionado')], default='en revision', max_length=30)),
            ],
        ),
    ]
