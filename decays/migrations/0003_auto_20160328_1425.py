# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('decays', '0002_auto_20160322_2221'),
    ]

    operations = [
        migrations.AddField(
            model_name='decaytype',
            name='daughter_one_decay',
            field=models.ForeignKey(related_name='decay_types_d1d', blank=True, to='decays.DecayType', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='decaytype',
            name='daughter_three_decay',
            field=models.ForeignKey(related_name='decay_types_d3d', blank=True, to='decays.DecayType', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='decaytype',
            name='daughter_two_decay',
            field=models.ForeignKey(related_name='decay_types_d2d', blank=True, to='decays.DecayType', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='decaytype',
            name='name',
            field=models.CharField(help_text=b'e.g., X-plus -> mu-plus + Y^0', max_length=60),
            preserve_default=True,
        ),
    ]
