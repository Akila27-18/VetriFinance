from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'title', 'amount', 'type', 'type_display', 'date', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value
