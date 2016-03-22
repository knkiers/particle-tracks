# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('decays', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AliasName',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(help_text=b'e.g., X^+', max_length=40)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DecayType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(help_text=b'e.g., X-plus -> mu-plus + Y^0', max_length=40)),
                ('daughter_one', models.ForeignKey(related_name='decay_types_d1', to='decays.Particle')),
                ('daughter_one_alias', models.ForeignKey(related_name='decay_types_d1a', blank=True, to='decays.AliasName', null=True)),
                ('daughter_three', models.ForeignKey(related_name='decay_types_d3', blank=True, to='decays.Particle', null=True)),
                ('daughter_three_alias', models.ForeignKey(related_name='decay_types_d3a', blank=True, to='decays.AliasName', null=True)),
                ('daughter_two', models.ForeignKey(related_name='decay_types_d2', to='decays.Particle')),
                ('daughter_two_alias', models.ForeignKey(related_name='decay_types_d2a', blank=True, to='decays.AliasName', null=True)),
                ('parent', models.ForeignKey(related_name='decay_types', to='decays.Particle')),
                ('parent_alias', models.ForeignKey(blank=True, to='decays.AliasName', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='particle',
            name='name',
            field=models.CharField(help_text=b'e.g., K^+', max_length=40),
            preserve_default=True,
        ),
    ]
