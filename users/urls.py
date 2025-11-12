from django.urls import path
from . import views

urlpatterns = [
    path('', views.front_page, name='front_page'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('faq/', views.faq, name='faq'),
    path('privacy-policy/', views.privacy_policy, name='privacy_policy'),
    path('terms-conditions/', views.terms_conditions, name='terms_conditions'),
    path('cookie-policy/', views.cookie_policy, name='cookie_policy'),
    path('disclaimer/', views.disclaimer, name='disclaimer'),
]
