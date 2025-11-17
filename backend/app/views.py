from rest_framework import viewsets, permissions
from .models import Expense, SharedBudget, ChatMessage
from .serializers import ExpenseSerializer, SharedBudgetSerializer, ChatMessageSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-created_at')
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class SharedBudgetViewSet(viewsets.ModelViewSet):
    queryset = SharedBudget.objects.all()
    serializer_class = SharedBudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all().order_by('created_at')
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# Simple news proxy endpoint could be added here to call NewsAPI and summarize via a small summarizer.
from rest_framework.decorators import api_view
import requests

@api_view(['GET'])
def news_list(request):
    # placeholder: in production, call NewsAPI / Moneycontrol and return summarized cards
    data = [
        {'id':1,'title':'Markets stable', 'summary':'Equity markets saw moderate gains today...'},
        {'id':2,'title':'Interest rate update', 'summary':'RBI keeps repo rate unchanged...'}
    ]
    return Response(data)
