from django.db import models

class Particle(models.Model):
    """
    A particular subatomic particle, with properties including
    its mass, charge and name.
    """
    POSITIVE = 1
    NEGATIVE = -1
    NEUTRAL = 0
    CHARGE_CHOICES = (
        (POSITIVE, '+'),
        (NEGATIVE, '-'),
        (NEUTRAL, '0')
        )
    
    verbose_name = models.CharField(max_length=40, help_text = "e.g., K-plus")
    name = models.CharField(max_length=40, help_text = "e.g., K^+")
    mass = models.FloatField(help_text = "mass in MeV/c^2")
    charge = models.IntegerField(choices = CHARGE_CHOICES)

    def __unicode__(self):
        return '{0}'.format(self.verbose_name)


class AliasName(models.Model):
    """
    Names of particle aliases, such as X^+, Y^0, etc.
    """
    name = models.CharField(max_length = 40, help_text = "e.g., X^+")

    def __unicode__(self):
        return self.name
    
class DecayType(models.Model):
    """
    A particular subatomic decay mode.  Notes: (i) can accommodate 1 -> 2
    and 1 -> 3 types of decays; (ii) if a particle has an 'alias', then its
    the particle's identity will be hidden from the user.
    """
    parent = models.ForeignKey(Particle, related_name = 'decay_types')
    # if parent_alias is blank, then there is no alias and the type of
    # parent particle is NOT hidden from the user
    parent_alias = models.ForeignKey(AliasName, blank = True, null = True)

    daughter_one = models.ForeignKey(Particle, related_name = 'decay_types_d1')
    daughter_one_alias = models.ForeignKey(AliasName,
                                           blank = True, null = True,
                                           related_name = 'decay_types_d1a')

    daughter_two = models.ForeignKey(Particle, related_name = 'decay_types_d2')
    daughter_two_alias = models.ForeignKey(AliasName,
                                           blank = True, null = True,
                                           related_name = 'decay_types_d2a')

    # the third decay particle is optional
    daughter_three = models.ForeignKey(Particle, related_name = 'decay_types_d3',
                                       blank = True, null = True)
    daughter_three_alias = models.ForeignKey(AliasName,
                                             blank = True, null = True,
                                           related_name = 'decay_types_d3a')
    
    name = models.CharField(max_length=40,
                            help_text = "e.g., X-plus -> mu-plus + Y^0")

    def __unicode__(self):
        return '{0}'.format(self.name)



