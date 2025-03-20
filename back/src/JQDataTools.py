"""
    JQ Data Tools


    created on 2025.3.20, Shanghai
"""

import jqdatasdk
import log
import os
import pandas as pd


class _JQData:
    def __init__(self):
        self.securities = pd.DataFrame()


__jqdata = _JQData()


def __cache_dir() -> str:
    return f'{os.environ["VC_DATA_CACHE_DIR"]}/jqdatatools'


def __auth() -> bool:
    KEY_USERNAME = 'VC_JQ_USERNAME'
    KEY_PASSWORD = 'VC_JQ_PASSWORD'
    if KEY_PASSWORD not in os.environ:
        log.error(f'{KEY_PASSWORD} should be passed by environment variables.')
        return False
    if KEY_USERNAME not in os.environ:
        log.error(f'{KEY_USERNAME} should be passed by environment variables.')
        return False
    
    jqdatasdk.auth(os.environ[KEY_USERNAME], os.environ[KEY_PASSWORD])
    return True


def __get_all_securities():

    cache_file = f'{__cache_dir()}/securities.csv'
    if os.path.exists(cache_file):
        __jqdata.securities = pd.read_csv(cache_file)
        log.info('JQDataTools: securities data loaded from cache.')
    else:
        __jqdata.securities = jqdatasdk.get_all_securities()
        os.makedirs(__cache_dir())
        __jqdata.securities.to_csv(cache_file)
        log.info(f'JQDataTools: secirities saved to {cache_file}')



def init() -> bool:
    if not __auth():
        return False
    
    __get_all_securities()
    
    return True
