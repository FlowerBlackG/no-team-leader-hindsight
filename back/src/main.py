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
CORS(app)


@app.route('/')
def root():
    return IResponse.ok("hello").to_dict()


@app.route('/ping', methods=['GET'])
def analyze():
    result = "pong"
    return IResponse.ok(result).to_dict()


def main() -> int:
    if not JQDataTools.init():
        return 1


    app.run(debug=True, port=5000)
    return 0


if __name__ == '__main__':
    exit(main())
    