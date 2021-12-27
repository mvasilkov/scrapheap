from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class RegistrationForm(UserCreationForm):
    def clean_username(self):
        username = self.cleaned_data['username']
        if len(username) < 6:
            raise forms.ValidationError('The username must be at least 6 characters long.')
        return username

    class Meta:
        model = User
        fields = ('username', 'password1', 'password2', 'email')
