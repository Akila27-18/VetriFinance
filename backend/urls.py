from django.contrib import admin
from django.urls import path, include
from dashboard import views as dashboard_views  # for dashboard_home view

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', include('users.urls')),  # home, register, login, etc.

    path('dashboard/', include('dashboard.urls')),
    path('transactions/', include('transactions.urls')),

    # Built-in auth (for password reset, etc.)
    path('accounts/auth/', include('django.contrib.auth.urls')),
]
