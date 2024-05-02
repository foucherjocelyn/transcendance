from rest_framework.exceptions import APIException

class CustomValidationError(APIException):
    status_code = 400
    default_detail = 'An error has occurred.'
    default_code = 'error'
