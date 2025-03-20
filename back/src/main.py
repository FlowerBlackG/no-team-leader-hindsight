from IResponse import IResponse
from flask import Flask, request
import json
import io
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/')
def root():
    return IResponse.ok("hello").to_dict()


@app.route('/ping', methods=['GET'])
def analyze():
    result = "pong"
    return IResponse.ok(result).to_dict()


if __name__ == '__main__':
    app.run(debug=True, port=5000)
