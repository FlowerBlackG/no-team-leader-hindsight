from IResponse import IResponse
from flask import Flask, request
import json
import io
from flask_cors import CORS
import sys

from gData import gData
import JQDataTools
import log
import jqdatasdk


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)


@app.route('/')
def root():
    return IResponse.ok("hello")


@app.route('/ping', methods=['GET'])
def ping():
    result = "pong"
    return IResponse.ok(result)


@app.route('/security-basic-info', methods=['GET'])
def get_security_basic_info():
    search = request.args.get('search')
    
    if (search is None) or (len(search) == 0):
        return IResponse.error(msg='bad argument.')
    
    res = JQDataTools.security_info(search)
    return IResponse.ok(res)


def main() -> int:
    if not JQDataTools.init():
        return 1


    app.run(debug=True, port=5000)
    return 0


if __name__ == '__main__':
    exit(main())
    