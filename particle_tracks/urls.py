from django.conf.urls import include

from django.conf.urls import patterns, url

from particle_tracks.views import IndexView

from rest_framework_nested import routers

from authentication.views import AccountViewSet
from authentication.views import LoginView
from authentication.views import LogoutView

from django.contrib import admin
from rest_framework.decorators import api_view
from decays import views

admin.autodiscover()

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)

urlpatterns = patterns(
     '',
    # ... URLs
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/v1/hello/$', views.hello_world),
    url(r'^api/v1/decaytypelist/$', views.decay_type_list),
    url(r'^api/v1/generateevent/$', views.generate_random_event),
    url('^.*$', IndexView.as_view(), name='index'),
)
