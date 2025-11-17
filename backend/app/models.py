from django.db import models
from django.contrib.auth.models import User

class Expense(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    shared = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.amount}"

class SharedBudget(models.Model):
    name = models.CharField(max_length=200)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    participants = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_msgs')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_msgs')
    text = models.TextField(blank=True)
    expense = models.ForeignKey(Expense, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
