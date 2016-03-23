from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from decays.models import *
from decays.serializers import DecayTypeSerializer

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
def event(request, pk):
    """
    Generate an event of decay type pk
    """
    # WORKING HERE....
    if request.method == 'GET':
        decay_types = DecayType.objects.all()
        serializer = DecayTypeSerializer(decay_types, many=True)
        return Response(serializer.data)

#
# MAKE SURE the user is logged in first...?  maybe don't need to do that for simple get requests like this....

# NEXT: add a function to the decay type model that computes a momentum configuration given
#       one or more angles, invariant masses, or something; and then one that calls this and
#       computes it randomly; then write an api for serving this up and a controller to go get it!
