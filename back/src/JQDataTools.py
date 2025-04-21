"""
    JQ Data Tools


    created on 2025.3.20, Shanghai
"""

import jqdatasdk
import log
import os
import pandas as pd

import structs


def _security_raw_row_to_instrument_info(row: pd.Series) -> structs.InstrumentInfo:
    inst = structs.InstrumentInfo()
    inst.id = row['instrument_id'].split('.')[0]
    inst.display_name = row['display_name'] # type: ignore
    inst.inst_type = row['type'] # type: ignore
    return inst


class _JQData:
    def __init__(self):

        # type -> ( 6-char code -> instrument )
        self.securities: dict[str, dict[str, structs.InstrumentInfo]] = dict()
        self.securities_raw = pd.DataFrame()

    def load(self, raw: pd.DataFrame):
        self.securities.clear()
        df = raw
        for _, row in df.iterrows():
            inst = _security_raw_row_to_instrument_info(row)

            if inst.inst_type not in self.securities:
                self.securities[inst.inst_type] = dict()
            
            self.securities[inst.inst_type][inst.id] = inst
        
        log.info('JQ Data loaded.')



__jqdata = _JQData()


def _cache_dir() -> str:
    KEY_DATA_CACHE_DIR = 'VC_DATA_CACHE_DIR'
    if KEY_DATA_CACHE_DIR not in os.environ:
        log.error(f'{KEY_DATA_CACHE_DIR} should be passed by environment variables.')
        raise KeyError(KEY_DATA_CACHE_DIR)
    return f'{os.environ[KEY_DATA_CACHE_DIR]}/jqdatatools'


def _auth() -> bool:
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


def _get_all_securities():

    cache_file_wo_extension = f'{_cache_dir()}/securities'
    cache_file_parquet = f'{cache_file_wo_extension}.parquet'
    cache_file_csv = f'{cache_file_wo_extension}.csv'

    if os.path.exists(cache_file_parquet):
        __jqdata.securities_raw = pd.read_parquet(cache_file_parquet, engine='pyarrow')
        log.info('JQDataTools: securities data loaded from cache (parquet).')
    elif os.path.exists(cache_file_csv):
        __jqdata.securities_raw = pd.read_csv(cache_file_csv, encoding='utf-8')
        log.info('JQDataTools: securities data loaded from cache (csv).')
    else:
        # Cache not found. Just download it.

        __jqdata.securities_raw = jqdatasdk.get_all_securities( # type: ignore
            types=[
                'stock', 'index', 'conbond', 'etf', 'lof', 'fja', 'fjb',
                'mixture_fund', 'bjse'
            ]
        )
        __jqdata.securities_raw.index.name = 'instrument_id'
        __jqdata.securities_raw.reset_index(inplace=True)
        
        os.makedirs(_cache_dir(), exist_ok=True)
        __jqdata.securities_raw.to_parquet(cache_file_parquet, engine='pyarrow')
        __jqdata.securities_raw.to_csv(cache_file_csv, encoding='utf-8')
        log.info(f'JQDataTools: secirities saved to {cache_file_parquet}')
        log.info(f'JQDataTools: secirities saved to {cache_file_csv}')
    
    __jqdata.load(__jqdata.securities_raw)


def security_info(search: str) -> list[structs.InstrumentInfo]:
    res = []
    for _, row in __jqdata.securities_raw.iterrows():
        if (search in row['instrument_id']) or (search in row['display_name']):
            res.append(_security_raw_row_to_instrument_info(row))
    return res


def init(cache_only=False) -> bool:
    if (not cache_only) and (not _auth()):
        return False
    
    _get_all_securities()
    
    return True
