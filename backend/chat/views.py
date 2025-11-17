# backend/chat/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ChatMessage
from .serializers import ChatMessageSerializer

@api_view(['GET'])
def recent_messages(request):
    limit = int(request.GET.get('limit', 100))
    msgs = ChatMessage.objects.order_by('created_at').all()[:limit]
    serializer = ChatMessageSerializer(msgs, many=True)
    return Response({"ok": True, "data": serializer.data})
