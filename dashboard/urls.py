from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_home, name='dashboard_home'),
    path('summary/', views.dashboard_summary, name='dashboard_summary'),
    path('download/', views.download_report, name='download_report'),

]
