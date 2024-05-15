wsgi_app = 'backend.wsgi:application'

bind = '0.0.0.0:8000'

workers = 4

keyfile = '/etc/backend/ssl/private.key'

certfile = '/etc/backend/ssl/certificate.crt'
