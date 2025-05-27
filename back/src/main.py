from IResponse import IResponse
from flask import Flask, request
from flask_cors import CORS
import MinuteData

import JQDataTools

import structs


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


def ignore_sze_stocks(data: list[structs.InstrumentInfo]) -> list[structs.InstrumentInfo]:
    res = []
    for it in data:
        if it.inst_type == 'stock' and it.id.startswith('0'):
            continue
        res.append(it)
    return res


@app.route('/security-basic-info', methods=['GET'])
def get_security_basic_info():
    search = request.args.get('search')
    
    if (search is None) or (len(search) == 0):
        return IResponse.error(msg='bad argument.')
    
    res = JQDataTools.security_info(search)
    return IResponse.ok(ignore_sze_stocks(res))


@app.route('/all-security-basic-info', methods=['GET'])
def get_all_security_basic_info():
    res = JQDataTools.all_security_info()
    return IResponse.ok(ignore_sze_stocks(res))


@app.route('/minute-data', methods=['GET'])
def get_minute_data():
    inst_id = request.args.get('instId')
    if (inst_id is None):
        return IResponse.error(msg='bad argument.')
    
    date = request.args.get('date')
    if date != '20240430':
        return IResponse.error(msg='not supported. this api is so naive.')
    
    if inst_id not in MinuteData.minute_data:
        return IResponse.error(msg=f'data of {inst_id} not found.')
    

    security_info_search_res = JQDataTools.security_info(f'{inst_id}')
    if len(security_info_search_res) == 0:
        return IResponse.error(msg='maybe internal error..')

    res = {
        'instInfo': security_info_search_res[0],
        'date': date,
        'minute': MinuteData.minute_data[inst_id]
    }
    return IResponse.ok(res)


def main() -> int:
    if not JQDataTools.init(cache_only=True):
        return 1
    
    if not MinuteData.init():
        return 1


    app.run(debug=True, port=5000)
    return 0


if __name__ == '__main__':
    exit(main())
    