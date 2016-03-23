from django.db import models
import math, random

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

    def is_two_body_decay(self):
        if self.daughter_three == None:
            return True
        else:
            return False
    


    def rand_momentum_config_parent_cm(self, xi_lab, theta_lab):
        """
        For a given DecayType object, determines a random configuration of momenta
        and energies for the final state particles in the parent center of mass, then 
        boosts by xi_lab and rotates by theta_lab.
        """
        if self.is_two_body_decay():
            costheta = -1+2*random.random()
            theta = math.acos(costheta)
            
            m_a = self.parent.mass
            m_b = self.daughter_one.mass
            m_c = self.daughter_two.mass
            
            p_b = momentum(m_a, m_b, m_c)
            energy_b = energy(m_b, p_b)
            p_c = p_b
            energy_c = energy(m_c, p_c)

            coords_a = [m_a, 0, 0]
            coords_b = [energy_b, 0, p_b]
            coords_c = [energy_c, 0, -p_b]

            # boost and rotate pa relative to the lab

            coords_a = boost_then_rotate(xi_lab, theta_lab, coords_a)
            
            # now rotate pb and pc (in the cm) and then boost and rotate relative to the lab
            
            coords_b = boost_then_rotate(xi_lab, theta_lab,
                                         boost_then_rotate(0, theta, coords_b))
            coords_c = boost_then_rotate(xi_lab, theta_lab,
                                         boost_then_rotate(0, theta, coords_c))

            print coords_a
            print coords_b
            print coords_c

            print [coords_b[0]+coords_c[0],coords_b[1]+coords_c[1],coords_b[2]+coords_c[2]]

            data_dict = {'is_two_body_decay': True,
                         'xi_lab': xi_lab,
                         'theta_lab': theta_lab,
                         'p_a': coords_a,
                         'p_b': coords_b,
                         'p_c': coords_c}                         
            
            return data_dict


def lambda_func(x, y, z):
    """
    Utility function used to find magnitude of the momenta of two particles 
    in the rest frame of the parent particle.
    """
    return x**2+y**2+z**2-2*(x*y+x*z+y*z)

def momentum(m_a, m_b, m_c):
    """
    Calculates the momenta of b and c in the rest from of a, for a -> b + c.
    """
    return math.sqrt(lambda_func(m_a**2, m_b**2, m_c**2))/2/m_a

def energy(m, p):
    """
    Calculates the energy of a particle that has mass m and momentum p.
    """
    return math.sqrt(m**2+p**2)

def boost_then_rotate(xi, theta, coord_list):
    """
    Performs a boost (boost parameter xi) in the y direction, 
    followed by a rotation by polar angle theta away from the 
    y axis, in the x-y plane.  coord_list is of the form [energy, x, y].
    """
    boost_matrix = [[math.cosh(xi), 0, math.sinh(xi)],
                    [math.sinh(xi)*math.sin(theta), math.cos(theta), math.cosh(xi)*math.sin(theta)],
                    [math.sinh(xi)*math.cos(theta), -math.sin(theta), math.cosh(xi)*math.cos(theta)]]

    boosted_coord_list = [0, 0, 0]

    for j in range(len(coord_list)):
        for i in range(len(boost_matrix[j])):
            boosted_coord_list[i] += boost_matrix[i][j]*coord_list[j]

    return boosted_coord_list
