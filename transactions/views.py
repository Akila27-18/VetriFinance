from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponse, JsonResponse, FileResponse
from django.utils import timezone
from django.db.models import Sum, Q
from datetime import timedelta
import csv

from .forms import TransactionForm
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

# ----------------------------
# API ViewSet (Optional REST)
# ----------------------------
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        return Transaction.objects.filter(user=user).order_by('-date') if user else Transaction.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def today_income(self, request):
        user = request.user if request.user.is_authenticated else None
        total_income = Transaction.get_today_income(user) if user else 0
        return Response({'today_income': total_income})


# ----------------------------
# Dashboard Home
# ----------------------------
@login_required
def dashboard_home(request):
    user = request.user

    total_income = Transaction.objects.filter(user=user, type='income').aggregate(total=Sum('amount'))['total'] or 0
    total_expense = Transaction.objects.filter(user=user, type='expense').aggregate(total=Sum('amount'))['total'] or 0
    net_balance = total_income - total_expense

    recent_transactions = Transaction.objects.filter(user=user).order_by('-date')[:7]

    # Prepare dummy weekly income for chart (can be replaced with real query)
    today = timezone.localdate()
    week_days = [(today - timedelta(days=today.weekday() - i)) for i in range(7)]
    weekly_income = [Transaction.objects.filter(user=user, type='income', date=day).aggregate(total=Sum('amount'))['total'] or 0 for day in week_days]
    week_days_labels = [day.strftime('%a') for day in week_days]

    context = {
        'total_income': total_income,
        'total_expense': total_expense,
        'net_balance': net_balance,
        'recent_transactions': recent_transactions,
        'weekly_income': weekly_income,
        'week_days_labels': week_days_labels
    }

    return render(request, 'dashboard/home.html', context)


# ----------------------------
# Transaction CRUD
# ----------------------------
@login_required
def add_transaction(request):
    if request.method == 'POST':
        form = TransactionForm(request.POST)
        if form.is_valid():
            transaction = form.save(commit=False)
            transaction.user = request.user
            transaction.save()
            messages.success(request, "✅ Transaction added successfully!")
            return redirect('transaction_list')
    else:
        form = TransactionForm()
    return render(request, 'transactions/add_transaction.html', {'form': form})

@login_required
def transaction_list(request):
    user = request.user
    transactions = Transaction.objects.filter(user=user).order_by('-date')

    t_type = request.GET.get('type')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if t_type:
        transactions = transactions.filter(type=t_type)
    if start_date:
        transactions = transactions.filter(date__gte=start_date)
    if end_date:
        transactions = transactions.filter(date__lte=end_date)

    context = {
        'transactions': transactions,
        'selected_type': t_type,
        'start_date': start_date,
        'end_date': end_date,
    }
    return render(request, 'transactions/transaction_list.html', context)

@login_required
def transaction_detail(request, pk):
    transaction = get_object_or_404(Transaction, pk=pk, user=request.user)
    return render(request, 'transactions/transaction_detail.html', {'transaction': transaction})

@login_required
def edit_transaction(request, pk):
    transaction = get_object_or_404(Transaction, pk=pk, user=request.user)
    if request.method == 'POST':
        form = TransactionForm(request.POST, instance=transaction)
        if form.is_valid():
            form.save()
            messages.success(request, "✏️ Transaction updated successfully!")
            return redirect('transaction_list')
    else:
        form = TransactionForm(instance=transaction)
    return render(request, 'transactions/edit_transaction.html', {'form': form, 'transaction': transaction})

@login_required
def delete_transaction(request, pk):
    transaction = get_object_or_404(Transaction, pk=pk, user=request.user)
    if request.method == 'POST':
        transaction.delete()
        messages.warning(request, "🗑️ Transaction deleted successfully.")
        return redirect('transaction_list')
    return render(request, 'transactions/confirm_delete.html', {'transaction': transaction})


# ----------------------------
# Export CSV
# ----------------------------
@login_required
def export_csv(request):
    user = request.user
    transactions = Transaction.objects.filter(user=user).order_by('-date')

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="transactions_{timezone.now().date()}.csv"'

    writer = csv.writer(response)
    writer.writerow(['Title', 'Amount', 'Type', 'Date', 'Notes'])
    for t in transactions:
        writer.writerow([t.title, t.amount, t.type, t.date, t.notes])

    return response


# ----------------------------
# Export PDF
# ----------------------------
@login_required
def export_pdf(request):
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
    from reportlab.lib import colors
    from reportlab.lib.units import inch

    transactions = Transaction.objects.filter(user=request.user).order_by('-date')
    total_income = sum(t.amount for t in transactions if t.type == 'income')
    total_expense = sum(t.amount for t in transactions if t.type == 'expense')
    net_balance = total_income - total_expense

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="transactions_report.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4
    y = height - inch

    # Header
    p.setFillColorRGB(0.2, 0.0, 0.5)
    p.rect(0, height - 1.2 * inch, width, 1.2 * inch, fill=1)
    p.setFillColor(colors.white)
    p.setFont("Helvetica-Bold", 22)
    p.drawString(1 * inch, height - 0.7 * inch, "Financial Dashboard Report")

    # User Info
    p.setFont("Helvetica", 12)
    p.drawString(1 * inch, height - 1.5 * inch, f"User: {request.user.username}")
    p.drawString(1 * inch, height - 1.8 * inch, f"Generated: {timezone.now().strftime('%Y-%m-%d %H:%M')}")

    # Table Headers
    y = height - 2.4 * inch
    p.setFillColorRGB(0.2, 0.0, 0.5)
    p.rect(0.8 * inch, y - 0.1 * inch, width - 1.6 * inch, 0.4 * inch, fill=1)
    p.setFillColor(colors.white)
    p.setFont("Helvetica-Bold", 12)
    p.drawString(1 * inch, y, "Title")
    p.drawString(2.8 * inch, y, "Amount")
    p.drawString(4 * inch, y, "Type")
    p.drawString(5 * inch, y, "Date")

    # Table Rows
    y -= 0.5 * inch
    row_color = [colors.whitesmoke, colors.lightgrey]
    i = 0
    for t in transactions:
        if y < 1.5 * inch:
            p.showPage()
            y = height - 1 * inch
            p.setFont("Helvetica", 11)
        p.setFillColor(row_color[i % 2])
        p.rect(0.8 * inch, y - 0.05 * inch, width - 1.6 * inch, 0.3 * inch, fill=1)
        p.setFillColor(colors.black)
        p.drawString(1 * inch, y, t.title[:20])
        p.drawString(2.8 * inch, y, f"${t.amount:.2f}")
        p.drawString(4 * inch, y, t.type.capitalize())
        p.drawString(5 * inch, y, str(t.date))
        y -= 0.35 * inch
        i += 1

    # Summary Box
    y -= 0.5 * inch
    p.setFillColorRGB(0.2, 0.0, 0.5)
    p.rect(0.8 * inch, y - 0.2 * inch, width - 1.6 * inch, 0.8 * inch, fill=1)
    p.setFillColor(colors.white)
    p.setFont("Helvetica-Bold", 12)
    p.drawString(1 * inch, y + 0.4 * inch, f"Total Income: ${total_income:.2f}")
    p.drawString(3 * inch, y + 0.4 * inch, f"Total Expense: ${total_expense:.2f}")
    p.drawString(5 * inch, y + 0.4 * inch, f"Net Balance: ${net_balance:.2f}")

    # Footer
    p.setFont("Helvetica-Oblique", 10)
    p.setFillColor(colors.gray)
    p.drawString(1 * inch, 0.8 * inch, "Generated by Financial Dashboard System © 2025")

    p.showPage()
    p.save()
    return response
@login_required
def download_report(request):
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    from io import BytesIO
    from datetime import datetime

    user = request.user
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, title="Vetri Finance - Report")
    styles = getSampleStyleSheet()
    elements = []

    # Custom Styles
    header_style = ParagraphStyle(
        'header',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        textColor=colors.HexColor("#4B0082"),
        alignment=1,
        fontSize=18,
        spaceAfter=20
    )
    normal_style = styles['Normal']

    # Header
    elements.append(Paragraph("💼 Vetri Finance - Financial Summary Report", header_style))
    elements.append(Paragraph(f"Generated for: <b>{user.username}</b>", normal_style))
    elements.append(Paragraph(f"Date: {datetime.now().strftime('%d %B %Y, %I:%M %p')}", normal_style))
    elements.append(Spacer(1, 20))

    # Summary Data
    total_income = Transaction.objects.filter(user=user, type='income').aggregate(total=Sum('amount'))['total'] or 0
    total_expense = Transaction.objects.filter(user=user, type='expense').aggregate(total=Sum('amount'))['total'] or 0
    net_balance = total_income - total_expense

    summary_data = [
        ["Total Income", f"₹{total_income:,.2f}"],
        ["Total Expense", f"₹{total_expense:,.2f}"],
        ["Net Balance", f"₹{net_balance:,.2f}"],
    ]
    summary_table = Table(summary_data, colWidths=[200, 200])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E5E0FF")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
    ]))
    elements.append(summary_table)  
    elements.append(Spacer(1, 30))
   