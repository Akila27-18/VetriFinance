from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Sum

@staticmethod
def get_total_by_type(user, trans_type):
    return Transaction.objects.filter(user=user, type=trans_type).aggregate(total=Sum('amount'))['total'] or 0


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    # ---- Core fields ----
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'

    def __str__(self):
        return f"{self.title} - {self.type} - {self.amount}"

    # ---- Core methods ----
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('transaction-detail', args=[str(self.id)])

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user.id,
            'title': self.title,
            'amount': float(self.amount),
            'type': self.type,
            'date': self.date.isoformat(),
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

    # ---- Utility and Class Methods ----
    @classmethod
    def create(cls, user, title, amount, type, date=None, notes=None):
        transaction = cls(
            user=user,
            title=title,
            amount=amount,
            type=type,
            date=date if date else timezone.localdate(),
            notes=notes,
        )
        transaction.save()
        return transaction

    @classmethod
    def get_by_user(cls, user):
        return cls.objects.filter(user=user)

    @classmethod
    def get_today_income(cls, user):
        from django.db.models import Sum
        today = timezone.localdate()
        return (
            cls.objects.filter(user=user, date=today, type='income')
            .aggregate(total=Sum('amount'))['total']
            or 0
        )

    @classmethod
    def get_summary_by_month(cls, user, year, month):
        from django.db.models import Sum
        from django.db.models.functions import TruncMonth

        qs = cls.objects.filter(user=user, date__year=year, date__month=month)
        summary = qs.annotate(month=TruncMonth('date')).values('month')
        summary = summary.annotate(
            total_income=Sum('amount', filter=models.Q(type='income')),
            total_expense=Sum('amount', filter=models.Q(type='expense')),
        )
        return summary
    @classmethod
    def get_today_income(cls, user):
        from django.utils import timezone
        from django.db.models import Sum
        today = timezone.localdate()
        total_income = cls.objects.filter(user=user, date=today, type='income').aggregate(total=Sum('amount'))['total'] or 0
        return total_income
    @classmethod
    def get_transactions_in_date_range(cls, user, start_date, end_date):
        return cls.objects.filter(user=user, date__gte=start_date, date__lte=end_date)
    @classmethod
    def bulk_create_transactions(cls, transactions_data):

        transactions = [cls(**data) for data in transactions_data]
        cls.objects.bulk_create(transactions)
        return transactions
    @classmethod
    def bulk_delete_transactions(cls, transaction_ids):
        cls.objects.filter(id__in=transaction_ids).delete()

    @classmethod
    def update_transaction(cls, transaction_id, **kwargs):
        cls.objects.filter(id=transaction_id).update(**kwargs)

    @classmethod
    def get_transaction_by_id(cls, transaction_id):
        return cls.objects.get(id=transaction_id)
    @classmethod
    def get_all_transactions(cls):
        return cls.objects.all()
    @classmethod
    def get_transactions_by_type(cls, user, transaction_type):
        return cls.objects.filter(user=user, type=transaction_type) 
    @classmethod
    def get_recent_transactions(cls, user, limit=10):
        return cls.objects.filter(user=user).order_by('-date')[:limit]
    
    @classmethod
    def get_total_transactions_count(cls, user):
        return cls.objects.filter(user=user).count()


    @classmethod
    def get_total_amount_by_type(cls, user, transaction_type):
        from django.db.models import Sum
        total = cls.objects.filter(user=user, type=transaction_type).aggregate(total=Sum('amount'))['total'] or 0
        return total
    @classmethod
    def get_average_transaction_amount(cls, user, transaction_type):
        from django.db.models import Avg
        average = cls.objects.filter(user=user, type=transaction_type).aggregate(average=Avg('amount'))['average'] or 0
        return average
    @classmethod
    def get_largest_transaction(cls, user, transaction_type):
        return cls.objects.filter(user=user, type=transaction_type).order_by('-amount').first()
    @classmethod
    def get_smallest_transaction(cls, user, transaction_type):
        return cls.objects.filter(user=user, type=transaction_type).order_by('amount').first()
    @classmethod
    def get_transaction_count(cls, user, transaction_type):
        return cls.objects.filter(user=user, type=transaction_type).count()
    @classmethod
    def get_monthly_totals(cls, user, year):
        from django.db.models.functions import TruncMonth
        from django.db.models import Sum
        qs = cls.objects.filter(user=user, date__year=year)
        monthly_totals = qs.annotate(month=TruncMonth('date')).values('month')
        monthly_totals = monthly_totals.annotate(
            total_income=Sum('amount', filter=models.Q(type='income')),
            total_expense=Sum('amount', filter=models.Q(type='expense'))
        ).order_by('month')
        return monthly_totals
    @classmethod
    def get_yearly_totals(cls, user):
        from django.db.models.functions import TruncYear
        from django.db.models import Sum
        qs = cls.objects.filter(user=user)
        yearly_totals = qs.annotate(year=TruncYear('date')).values('year')
        yearly_totals = yearly_totals.annotate(
            total_income=Sum('amount', filter=models.Q(type='income')),
            total_expense=Sum('amount', filter=models.Q(type='expense'))
        ).order_by('year')
        return yearly_totals
    @classmethod
    def get_average_monthly_totals(cls, user):
        from django.db.models.functions import TruncMonth
        from django.db.models import Avg, Sum
        qs = cls.objects.filter(user=user)
        monthly_totals = qs.annotate(month=TruncMonth('date')).values('month')
        monthly_totals = monthly_totals.annotate(
            total_income=Sum('amount', filter=models.Q(type='income')),
            total_expense=Sum('amount', filter=models.Q(type='expense'))
        )
        average_income = monthly_totals.aggregate(average_income=Avg('total_income'))['average_income'] or 0
        average_expense = monthly_totals.aggregate(average_expense=Avg('total_expense'))['average_expense'] or 0
        return {
            'average_monthly_income': average_income,
            'average_monthly_expense': average_expense
        }
    @classmethod
    def get_transactions_grouped_by_type(cls, user):
        from django.db.models import Sum
        qs = cls.objects.filter(user=user)
        grouped = qs.values('type').annotate(total_amount=Sum('amount'))
        return grouped
    @classmethod
    def get_transactions_within_amount_range(cls, user, min_amount, max_amount):
        return cls.objects.filter(user=user, amount__gte=min_amount, amount__lte=max_amount)
    @classmethod
    def get_transactions_ordered_by_amount(cls, user, descending=False):
        order = '-amount' if descending else 'amount'
        return cls.objects.filter(user=user).order_by(order)
    @classmethod
    def get_transactions_by_date(cls, user, specific_date):
        return cls.objects.filter(user=user, date=specific_date)
    @classmethod
    def get_transactions_excluding_type(cls, user, transaction_type):
        return cls.objects.filter(user=user).exclude(type=transaction_type)
    @classmethod
    def get_total_transactions_amount(cls, user):   
        from django.db.models import Sum
        total = cls.objects.filter(user=user).aggregate(total=Sum('amount'))['total'] or 0
        return total
    @classmethod
    def get_distinct_transaction_types(cls, user):
        return cls.objects.filter(user=user).values_list('type', flat=True).distinct()
    @classmethod
    def get_transactions_count_by_date_range(cls, user, start_date, end_date):
        return cls.objects.filter(user=user, date__gte=start_date, date__lte=end_date).count()
    @classmethod
    def get_high_value_transactions(cls, user, threshold):
        return cls.objects.filter(user=user, amount__gt=threshold)
    @classmethod
    def get_low_value_transactions(cls, user, threshold):
        return cls.objects.filter(user=user, amount__lt=threshold)
    @classmethod
    def get_transactions_with_notes(cls, user):
        return cls.objects.filter(user=user).exclude(notes__isnull=True).exclude(notes__exact='')
    @classmethod
    def get_transactions_without_notes(cls, user):
        return cls.objects.filter(user=user).filter(models.Q(notes__isnull=True) | models.Q(notes__exact=''))
    @classmethod
    def get_transactions_by_title_keyword(cls, user, keyword):
        return cls.objects.filter(user=user, title__icontains=keyword)
    @classmethod
    def get_transactions_by_multiple_types(cls, user, types_list):
        return cls.objects.filter(user=user, type__in=types_list)
    @classmethod
    def get_transactions_excluding_multiple_types(cls, user, types_list):
        return cls.objects.filter(user=user).exclude(type__in=types_list)
    @classmethod
    def get_transactions_grouped_by_date(cls, user):
        from django.db.models import Sum
        qs = cls.objects.filter(user=user)
        grouped = qs.values('date').annotate(total_amount=Sum('amount')).order_by('date')
        return grouped
    @classmethod
    def get_transactions_with_pagination(cls, user, offset=0, limit=10):
        return cls.objects.filter(user=user).order_by('-date')[offset:offset+limit]
    @classmethod
    def get_transactions_summary(cls, user):    
        from django.db.models import Sum
        total_income = cls.objects.filter(user=user, type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = cls.objects.filter(user=user, type='expense').aggregate(total=Sum('amount'))['total'] or 0
        net_balance = total_income - total_expense
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'net_balance': net_balance
        }
    @classmethod
    def get_transactions_by_year(cls, user, year):
        return cls.objects.filter(user=user, date__year=year)
    @classmethod
    def get_transactions_by_month(cls, user, year, month):
        return cls.objects.filter(user=user, date__year=year, date__month=month)
    @classmethod
    def get_transactions_by_week(cls, user, year, week):
        return cls.objects.filter(user=user, date__year=year, date__week=week)  
    @classmethod
    def get_transactions_count_by_type(cls, user):
        from django.db.models import Count
        qs = cls.objects.filter(user=user)
        count_by_type = qs.values('type').annotate(count=Count('id'))
        return count_by_type
    @classmethod
    def get_transactions_summary_by_date_range(cls, user, start_date, end_date):
        from django.db.models import Sum
        qs = cls.objects.filter(user=user, date__gte=start_date, date__lte=end_date)
        total_income = qs.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = qs.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
        net_balance = total_income - total_expense
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'net_balance': net_balance
        }
    @classmethod
    def get_transactions_within_last_n_days(cls, user, n):
        from django.utils import timezone
        from datetime import timedelta
        end_date = timezone.localdate()
        start_date = end_date - timedelta(days=n)
        return cls.objects.filter(user=user, date__gte=start_date, date__lte=end_date)
    @classmethod
    def get_transactions_grouped_by_user(cls):
        from django.db.models import Sum
        qs = cls.objects.all()
        grouped = qs.values('user').annotate(total_amount=Sum('amount'))
        return grouped
    @classmethod
    def get_transactions_with_custom_filter(cls, **filters):
        return cls.objects.filter(**filters)
    @classmethod
    def get_transactions_excluding_custom_filter(cls, **filters):
        return cls.objects.exclude(**filters)
    @classmethod
    def get_transactions_count_with_custom_filter(cls, **filters):
        return cls.objects.filter(**filters).count()
    @classmethod
    def get_transactions_count_excluding_custom_filter(cls, **filters):
        return cls.objects.exclude(**filters).count()
    @classmethod
    def get_transactions_summary_with_custom_filter(cls, **filters):
        from django.db.models import Sum
        qs = cls.objects.filter(**filters)
        total_income = qs.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = qs.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
        net_balance = total_income - total_expense
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'net_balance': net_balance
        }
    @classmethod
    def get_transactions_summary_excluding_custom_filter(cls, **filters):
        from django.db.models import Sum
        qs = cls.objects.exclude(**filters)
        total_income = qs.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = qs.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
        net_balance = total_income - total_expense
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'net_balance': net_balance
        }       
    @classmethod
    def get_transactions_with_custom_ordering(cls, user, *ordering_fields):
        return cls.objects.filter(user=user).order_by(*ordering_fields)
    @classmethod
    def get_transactions_count_grouped_by_type(cls, user):
        from django.db.models import Count
        qs = cls.objects.filter(user=user)
        count_by_type = qs.values('type').annotate(count=Count('id'))
        return count_by_type
    @classmethod
    def get_transactions_summary_grouped_by_type(cls, user):
        from django.db.models import Sum
        qs = cls.objects.filter(user=user)
        summary_by_type = qs.values('type').annotate(total_amount=Sum('amount'))
        return summary_by_type
    @classmethod
    def get_transactions_with_custom_annotations(cls, user, **annotations):
        qs = cls.objects.filter(user=user)
        return qs.annotate(**annotations)
    @classmethod
    def get_transactions_excluding_custom_annotations(cls, user, **annotations):
        qs = cls.objects.filter(user=user)
        return qs.exclude(**annotations)
    @classmethod
    def get_transactions_count_with_custom_annotations(cls, user, **annotations):
        qs = cls.objects.filter(user=user)
        return qs.annotate(**annotations).count()   
    @classmethod
    def get_transactions_count_excluding_custom_annotations(cls, user, **annotations):
        qs = cls.objects.filter(user=user)
        return qs.exclude(**annotations).count()
    @classmethod
    def get_transactions_summary_with_custom_annotations(cls, user, **annotations):
        from django.db.models import Sum
        qs = cls.objects.filter(user=user)
        annotated_qs = qs.annotate(**annotations)
        total_income = annotated_qs.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = annotated_qs.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
        net_balance = total_income - total_expense
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'net_balance': net_balance
        }
    @classmethod
    def get_transactions_summary_excluding_custom_annotations(cls, user, **annotations):
        from django.db.models import Sum
        qs = cls.objects.filter(user=user)
        annotated_qs = qs.exclude(**annotations)
        total_income = annotated_qs.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = annotated_qs.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
        net_balance = total_income - total_expense
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'net_balance': net_balance
        }