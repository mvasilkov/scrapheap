from django.contrib.auth.validators import UnicodeUsernameValidator


class PathConverter:
    regex = UnicodeUsernameValidator.regex.strip('^$')

    @staticmethod
    def to_python(value: str):
        return value

    @staticmethod
    def to_url(value: str):
        return value
