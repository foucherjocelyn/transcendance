import os

app = {
    "SECRET_KEY": os.getenv("SECRET_KEY"),
    "POSTGRES_DB": os.getenv("POSTGRES_DB"),
    "POSTGRES_USER": os.getenv("POSTGRES_USER"),
    "POSTGRES_PASSWORD": os.getenv("POSTGRES_PASSWORD"),
    "POSTGRES_PORT": os.getenv("POSTGRES_PORT"),
    "BACKEND_PORT": os.getenv("BACKEND_PORT"),
    "FRONTEND_PORT": os.getenv("FRONTEND_PORT"),
    "BACKEND_URL": os.getenv("BACKEND_URL"),
    "FRONTEND_URL": os.getenv("FRONTEND_URL"),
    "SSL_CERTIFICATE": os.getenv("SSL_CERTIFICATE"),
    "SSL_CERTIFICATE_KEY": os.getenv("SSL_CERTIFICATE_KEY"),
    "dev": {
        "DEBUG": os.getenv("DEBUG_DEV"),
        "POSTGRES_HOST": os.getenv("POSTGRES_HOST_DEV"),
        "DATABASE_URL": os.getenv("DATABASE_URL_DEV"),
    },
    "prod": {
        "DEBUG": os.getenv("DEBUG_PROD"),
        "POSTGRES_HOST": os.getenv("POSTGRES_HOST_PROD"),
        "DATABASE_URL": os.getenv("DATABASE_URL_PROD"),
    },
}
