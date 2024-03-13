from django.urls import path, include

from accounts.views import login_view, register_view, logout_view, AddContactView, GetContactsView, GetUserDetailsView, EditUserView, EmailContactsView
app_name = 'accounts'

urlpatterns = [
    path('login/', login_view.as_view(), name='login'),
    path('register/', register_view.as_view(), name='register'),
    path('logout/', logout_view.as_view(), name='logout'),
    path('add-contact/', AddContactView.as_view(), name='add-contact'),
    path('get-contacts/', GetContactsView.as_view(), name='get-contacts'),
    path('get-user-details/', GetUserDetailsView.as_view(), name='get-user-details'),
    path('edit-user/', EditUserView.as_view(), name='edit-user'),
    path('email-contacts/', EmailContactsView.as_view(), name='email-contacts'),
]