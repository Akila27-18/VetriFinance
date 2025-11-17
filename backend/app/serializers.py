from rest_framework import serializers
from .models import Expense, SharedBudget, ChatMessage
from django.contrib.auth.models import User

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'

class SharedBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedBudget
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']
