from django.contrib.auth.models import User

import pytest
import requests

CREDENTIALS = {
    'username': 'rei',
    'password': 'reireirei',
}


def initialize_user():
    User.objects.create_user(**CREDENTIALS)


def get_auth_token(live_server: str):
    r = requests.post(f'{live_server}/api/auth/token/', data=CREDENTIALS)
    assert r.status_code == 200
    res = r.json()
    return res['token']


@pytest.mark.django_db
def test_api_auth_self(live_server):
    initialize_user()

    r = requests.get(f'{live_server}/api/auth/self/')
    assert r.status_code == 401  # Unauthorized

    token = get_auth_token(live_server)

    r = requests.get(f'{live_server}/api/auth/self/', headers={'Authorization': f'JWT {token}'})
    assert r.status_code == 200
    res = r.json()
    assert res['username'] == CREDENTIALS['username']
