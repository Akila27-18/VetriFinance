# backend/chat/serializers.py
from rest_framework import serializers
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "from_user", "text", "time", "created_at", "delivered", "seen"]
