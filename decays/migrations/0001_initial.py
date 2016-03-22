# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Particle',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('verbose_name', models.CharField(help_text=b'e.g., K-plus', max_length=40)),
                ('name', models.CharField(help_text=b'e.g., K^\\+', max_length=40)),
                ('mass', models.FloatField(help_text=b'mass in MeV/c^2')),
                ('charge', models.IntegerField(choices=[(1, b'+'), (-1, b'-'), (0, b'0')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
