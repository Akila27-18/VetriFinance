from django.shortcuts import render
from django.utils import timezone
from django.db.models import Sum
from datetime import timedelta, datetime
from django.http import JsonResponse, FileResponse
from django.contrib.auth.decorators import login_required
from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from transactions.models import Transaction


# -------------------------------------
# Helper: Filter Transactions by Period
# -------------------------------------
def filter_transactions(user, period):
    today = timezone.localdate()
    qs = Transaction.objects.filter(user=user)
    if period == 'today':
        qs = qs.filter(date=today)
    elif period == 'week':
        start_week = today - timedelta(days=today.weekday())
        qs = qs.filter(date__gte=start_week)
    elif period == 'month':
        qs = qs.filter(date__month=today.month, date__year=today.year)
    elif period == 'year':
        qs = qs.filter(date__year=today.year)
    return qs


# -------------------------------------
# Dashboard Home (main page)
# -------------------------------------
@login_required(login_url='login')
def dashboard_home(request):
    user = request.user

    # Filters
    transactions = Transaction.objects.filter(user=user).order_by('-date')
    selected_type = request.GET.get('type', '')
    start_date = request.GET.get('start_date', '')
    end_date = request.GET.get('end_date', '')

    if selected_type:
        transactions = transactions.filter(type=selected_type)
    if start_date:
        transactions = transactions.filter(date__gte=start_date)
    if end_date:
        transactions = transactions.filter(date__lte=end_date)

    total_income = transactions.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
    total_expense = transactions.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
    net_balance = total_income - total_expense

    recent_transactions = transactions[:10]

    today = timezone.localdate()
    start_week = today - timedelta(days=today.weekday())
    week_days = [(start_week + timedelta(days=i)) for i in range(7)]
    weekly_income = [
        Transaction.objects.filter(user=user, type='income', date=day).aggregate(total=Sum('amount'))['total'] or 0
        for day in week_days
    ]

    context = {
        'total_income': total_income,
        'total_expense': total_expense,
        'net_balance': net_balance,
        'recent_transactions': recent_transactions,
        'selected_type': selected_type,
        'start_date': start_date,
        'end_date': end_date,
        'weekly_income': weekly_income,
        'week_days_labels': [day.strftime('%a') for day in week_days],
    }

    return render(request, 'dashboard/home.html', context)


# -------------------------------------
# Dashboard Summary (Optimized AJAX endpoint)
# -------------------------------------
from django.db.models import Sum
from collections import defaultdict

@login_required(login_url='login')
def dashboard_summary(request):
    user = request.user
    period = request.GET.get('period', 'month')

    transactions = filter_transactions(user, period)
    total_income = transactions.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
    total_expense = transactions.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
    net_balance = total_income - total_expense

    # Weekly breakdown (Mon–Sun)
    today = timezone.localdate()
    start_week = today - timedelta(days=today.weekday())
    week_days = [(start_week + timedelta(days=i)) for i in range(7)]
    week_labels = [day.strftime('%a') for day in week_days]

    # Fetch all transactions for this week at once
    week_qs = Transaction.objects.filter(user=user, date__in=week_days)
    daily_totals = (
        week_qs.values('date', 'type')
        .annotate(total=Sum('amount'))
    )

    # Initialize empty data
    income_map = defaultdict(float)
    expense_map = defaultdict(float)

    # Fill in the totals per day
    for entry in daily_totals:
        date = entry['date']
        if entry['type'] == 'income':
            income_map[date] = entry['total']
        elif entry['type'] == 'expense':
            expense_map[date] = entry['total']

    # Build ordered lists for Chart.js
    weekly_income = [float(income_map.get(day, 0)) for day in week_days]
    weekly_expense = [float(expense_map.get(day, 0)) for day in week_days]

    return JsonResponse({
        'income': float(total_income),
        'expense': float(total_expense),
        'balance': float(net_balance),
        'weekly_income': weekly_income,
        'weekly_expense': weekly_expense,
        'week_labels': week_labels,
    })


# -------------------------------------
# Download PDF Report
# -------------------------------------
@login_required(login_url='login')
def download_report(request):
    user = request.user
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, title="Vetri Finance - Report")
    styles = getSampleStyleSheet()
    elements = []

    # Styles
    header_style = ParagraphStyle(
        'header',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        textColor=colors.HexColor("#4B0082"),
        alignment=1,
        fontSize=18,
        spaceAfter=20
    )

    # Header
    elements.append(Paragraph("💼 Vetri Finance - Financial Summary Report", header_style))
    elements.append(Paragraph(f"Generated for: <b>{user.username}</b>", styles['Normal']))
    elements.append(Paragraph(f"Date: {datetime.now().strftime('%d %B %Y, %I:%M %p')}", styles['Normal']))
    elements.append(Spacer(1, 20))

    # Totals
    total_income = Transaction.objects.filter(user=user, type='income').aggregate(total=Sum('amount'))['total'] or 0
    total_expense = Transaction.objects.filter(user=user, type='expense').aggregate(total=Sum('amount'))['total'] or 0
    net_balance = total_income - total_expense

    summary_data = [
        ["Total Income", f"₹{total_income:,.2f}"],
        ["Total Expense", f"₹{total_expense:,.2f}"],
        ["Net Balance", f"₹{net_balance:,.2f}"],
    ]

    table = Table(summary_data, colWidths=[200, 200])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E5E0FF")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))

    # Recent Transactions
    elements.append(Paragraph("📜 Recent Transactions", styles['Heading2']))
    elements.append(Spacer(1, 10))

    transactions = Transaction.objects.filter(user=user).order_by('-date')[:10]
    if transactions.exists():
        data = [["Title", "Type", "Amount", "Date"]]
        for t in transactions:
            data.append([t.title, t.type.title(), f"₹{t.amount:,.2f}", t.date.strftime("%d-%m-%Y")])

        t_table = Table(data, colWidths=[150, 100, 100, 100])
        t_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#C7D2FE")),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        elements.append(t_table)
    else:
        elements.append(Paragraph("No recent transactions found.", styles['Normal']))

    elements.append(Spacer(1, 30))
    elements.append(Paragraph("Thank you for using Vetri Finance 💜",
                              ParagraphStyle('footer', alignment=1, textColor=colors.gray, fontSize=10)))

    doc.build(elements)
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="VetriFinance_Report.pdf")
