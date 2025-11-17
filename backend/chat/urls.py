# backend/chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("messages/", views.recent_messages, name="chat-messages"),
]
