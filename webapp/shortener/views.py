from django import forms
from django.shortcuts import get_object_or_404, redirect, render
from .models import TargetUrl

DIGITS = 'BCDFGHJKLMNPQRSTVWXYZbcdfghjkmnpqrstvwxyz23456789-_'
BASE = len(DIGITS)  # 51

def encode(x):
    # edge cases
    if x < 0:
        return None
    if x == 0:
        return DIGITS[0]

    string = ''
    while x > 0:
        string = DIGITS[x % BASE] + string
        x = x // BASE
    return string

def decode(string):
    x = 0
    for c in string:
        index = DIGITS.find(c)
        if index == -1:  # character not found
            return None
        x = x * BASE + index
    return x


class TargetUrlForm(forms.ModelForm):
    class Meta:
        model = TargetUrl
        fields = ['url']
        labels = {'url': 'Enter a link to shorten it:'}
        widgets = {'url': forms.TextInput(attrs={
            'placeholder': 'http://example.com/'
        })}


def submit(request):
    if request.method == 'POST':
        form = TargetUrlForm(request.POST)
        if form.is_valid():
            model = form.save()
            return redirect('success', short_url=encode(model.id))
    else:
        form = TargetUrlForm()

    return render(request, 'submit.html', {'form': form})

def success(request, short_url):
    return render(request, 'success.html', {
        'short_url': request.build_absolute_uri('/' + short_url)
    })

def redirect_view(request, short_url):
    target_url = get_object_or_404(TargetUrl, id=decode(short_url))
    return redirect(target_url, permanent=True)
