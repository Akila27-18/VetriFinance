from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils import timezone

def privacy_policy(request):
    return render(request, 'registration/privacy_policy.html')
def terms_conditions(request):
    return render(request, 'registration/terms_conditions.html')

def front_page(request):
    """Public front page with Login/Register or Logout button."""
    return render(request, 'registration/front_page.html')

def about(request):
    """About page."""
    return render(request, 'registration/about.html')

from django.views.decorators.http import require_POST
from django.contrib.auth import logout

@require_POST
def logout_view(request):
    """Logs out the user safely using POST."""
    logout(request)
    return redirect('front_page')





from django.core.mail import send_mail, BadHeaderError
from django.contrib import messages
from django.shortcuts import render, redirect
from django.conf import settings

def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        message = request.POST.get('message', '').strip()

        # ✅ Validation
        if len(name) < 3 or len(message) < 10:
            messages.error(request, "Please fill out all fields correctly.")
        elif '@' not in email or '.' not in email:
            messages.error(request, "Please enter a valid email address.")
        else:
            subject = f"New Contact Message from {name}"
            body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"

            try:
                send_mail(
                    subject,
                    body,
                    settings.DEFAULT_FROM_EMAIL,  # From
                    [settings.CONTACT_RECEIVER_EMAIL],  # To (you)
                    fail_silently=False,
                )
                messages.success(request, f"✅ Thank you, {name}! Your message has been sent successfully.")
                return redirect('contact')

            except BadHeaderError:
                messages.error(request, "Invalid header found. Please try again.")
            except Exception as e:
                messages.error(request, f"⚠️ Failed to send email: {e}")

    return render(request, 'registration/contact.html')





def register(request):
    """Register a new user."""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, "🎉 Account created successfully! Please log in.")
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

def cookie_policy(request):
    return render(request, 'registration/cookie_policy.html')

def disclaimer(request):
    return render(request, 'registration/disclaimer.html')

def login_view(request):
    """Custom login view."""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"👋 Welcome back, {user.username}!")
            return redirect('dashboard_home')
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})
def faq(request):
    return render(request, 'registration/faq.html', {'today': timezone.now()})





