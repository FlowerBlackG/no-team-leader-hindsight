from enum import Enum
import json
from http import HTTPStatus


class IResponse:
    def __init__(self, data, code: HTTPStatus, msg: str|None):
        self.data = data
        self.code = code
        self.msg = msg

    @staticmethod
    def ok(data=None, msg=None, code=HTTPStatus.OK):
        return IResponse(data, code.value, msg or code.phrase)

    @staticmethod
    def error(data=None, msg=None, code=HTTPStatus.NOT_ACCEPTABLE):
        return IResponse(data, code.value, msg or code.phrase)
    
    def to_dict(self):
        return {
            "data": self.data,
            "code": self.code,
            "msg": self.msg
        }
