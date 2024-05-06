from rest_framework.exceptions import APIException


class InputValidationError(APIException):
    status_code = 400
    default_detail = "Input invalid"
    default_code = "error"
