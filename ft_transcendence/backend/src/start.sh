#!/bin/sh
# Check if have keys folder
if [ ! -d "keys" ]; then
    mkdir keys
    # Generate keys
    openssl genrsa -out ./keys/private_key.pem 2048
    openssl rsa -in ./keys/private_key.pem -pubout -out ./keys/public_key.pem
fi

pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
pipenv run gunicorn --log-file=- --reload -c /home/backend/src/gunicorn/gunicorn.conf.py
