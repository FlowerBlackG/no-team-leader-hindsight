from enum import Enum
import json
from http import HTTPStatus
import flask


class IResponseJSONEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__


class IResponse:
    def __init__(self, data, code: HTTPStatus, msg: str|None):
        self.data = data
        self.code = code
        self.msg = msg

    @staticmethod
    def ok(data=None, msg=None, code=HTTPStatus.OK):
        ires = IResponse(data, code.value, msg or code.phrase)
        return flask.Response(json.dumps(ires, cls=IResponseJSONEncoder, ensure_ascii=False), content_type='application/json')

    @staticmethod
    def error(data=None, msg=None, code=HTTPStatus.NOT_ACCEPTABLE):
        ires = IResponse(data, code.value, msg or code.phrase)
        return flask.Response(json.dumps(ires, cls=IResponseJSONEncoder, ensure_ascii=False), content_type='application/json')
    
