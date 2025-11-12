from django.urls import path
from . import views

urlpatterns = [
    path('', views.transaction_list, name='transaction_list'),
    path('add/', views.add_transaction, name='add_transaction'),
    path('<int:pk>/', views.transaction_detail, name='transaction_detail'),
    path('<int:pk>/edit/', views.edit_transaction, name='edit_transaction'),
    path('<int:pk>/delete/', views.delete_transaction, name='delete_transaction'),
    path('export_csv/', views.export_csv, name='export_csv'),
    path('export/pdf/', views.export_pdf, name='export_pdf'),
]
