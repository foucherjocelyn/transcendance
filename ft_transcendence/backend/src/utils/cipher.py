from backend.settings import SECRET_KEY

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.padding import PKCS7
import base64
import hashlib


def encrypt(data: str, key: str = SECRET_KEY) -> str:
    """
    Encrypt data using the AES symmetric algorithm and a secret key.
    """
    keyBytes = hashlib.sha256(key.encode()).digest()
    cipher = Cipher(
        algorithms.AES(keyBytes), modes.ECB(), backend=default_backend()
    )
    encryptor = cipher.encryptor()
    padder = PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(data.encode()) + padder.finalize()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()
    return base64.b64encode(ciphertext).decode()


def decrypt(encrypted_data: str, key: str = SECRET_KEY) -> str:
    """
    Decrypt data using the AES symmetric algorithm and a secret key.
    """
    keyBytes = hashlib.sha256(key.encode()).digest()
    cipher = Cipher(
        algorithms.AES(keyBytes), modes.ECB(), backend=default_backend()
    )
    decryptor = cipher.decryptor()
    plaintext = decryptor.update(base64.b64decode(encrypted_data.encode()))
    unpadder = PKCS7(algorithms.AES.block_size).unpadder()
    unpadded_data = unpadder.update(plaintext) + unpadder.finalize()
    return unpadded_data.decode()
