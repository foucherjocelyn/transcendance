from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

def hash_password(password):
    """
    Hashes the given password using the PBKDF2 algorithm.
    """
    return make_password(password)


def verify_password(password, hashed_password):
    """
    Verifies the given password against the hashed password.
    """
    return check_password(password, hashed_password)
