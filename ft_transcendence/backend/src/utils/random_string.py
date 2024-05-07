# Genereate a random string 64 charaters include symbols with crytography
import secrets
import string


def generate_random_string(length=64):
    """
    Generates a random string of the specified length, including letters, digits, and symbols.
    """
    characters = (
        string.ascii_letters
        + string.digits
        + string.punctuation.replace("'", "").replace('"', "").replace("`", "")
    )
    return "".join(secrets.choice(characters) for _ in range(length))


print(generate_random_string(200))
