from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from decays.models import *
from decays.serializers import DecayTypeSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.utils.six import BytesIO

from django.http import HttpResponse
import json


import random

@api_view()
def hello_world(request):
    return Response({"message": "Hello, world!"})

@api_view(['GET'])
def decay_type_list(request):
    """
    List all types of decays.
    """
    if request.method == 'GET':
        decay_types = DecayType.objects.all()
        serializer = DecayTypeSerializer(decay_types, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def generate_random_event(request):
    """
    Generate a random event.
    """

    xi_lab = 0.5
    theta_lab = 1.234234234
    
    id_list = []
    for decay_type in DecayType.objects.all():
        id_list.append(decay_type.id)

    pk = random.choice(id_list)

    decay_type = DecayType.objects.get(pk=pk)
    data = decay_type.rand_momentum_config_parent_cm(xi_lab, theta_lab)
    data_json = json.dumps(data)

    print data_json
    
    context = {'data': data}

    return Response(data_json)

#
# MAKE SURE the user is logged in first...?  maybe don't need to do that for simple get requests like this....

# NEXT: add a function to the decay type model that computes a momentum configuration given
#       one or more angles, invariant masses, or something; and then one that calls this and
#       computes it randomly; then write an api for serving this up and a controller to go get it!
