"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from myapp.views.charging_station_views import (
    AddChargingStationView,
    GetUserChargingStationsView,
    GetAllChargingStationsView,
)
from myapp.views.cognito_auth_views import (
    CognitoSignupView,
    CognitoLoginView,
)

urlpatterns = [
    path("signup/", CognitoSignupView.as_view(), name="signup"),
    path("login/", CognitoLoginView.as_view(), name="login"),
    path(
        "charging-stations/add/",
        AddChargingStationView.as_view(),
        name="add_charging_station",
    ),
    path(
        "charging-stations/user/",
        GetUserChargingStationsView.as_view(),
        name="get-user-charging-stations",
    ),
    path(
        "charging-stations/all/",
        GetAllChargingStationsView.as_view(),
        name="get-all-charging-stations",
    ),
]
