"""
    JQ Data Tools


    created on 2025.3.20, Shanghai
"""

import jqdatasdk
import log
import os
import pandas as pd

import structs

class _JQData:
    def __init__(self):

        # type -> ( 6-char code -> instrument )
        self.securities: dict[str, dict[str, structs.InstrumentInfo]] = dict()

    def load(self, raw: pd.DataFrame):
        self.securities.clear()
        df = raw
        for _, row in df.iterrows():
            inst = structs.InstrumentInfo()
            inst.id = row.iloc[0].split('.')[0]
            inst.display_name = row['display_name'] # type: ignore
            inst.inst_type = row['type'] # type: ignore

            if inst.inst_type not in self.securities:
                self.securities[inst.inst_type] = dict()
            
            self.securities[inst.inst_type][inst.id] = inst
        
        log.info('JQ Data loaded.')



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

    cache_file_wo_extension = f'{__cache_dir()}/securities'
    cache_file_parquet = f'{cache_file_wo_extension}.parquet'
    cache_file_csv = f'{cache_file_wo_extension}.csv'

    securities_raw: pd.DataFrame
    
    if os.path.exists(cache_file_parquet):
        securities_raw = pd.read_parquet(cache_file_parquet, engine='pyarrow')
        log.info('JQDataTools: securities data loaded from cache (parquet).')
    elif os.path.exists(cache_file_csv):
        securities_raw = pd.read_csv(cache_file_csv, encoding='utf-8')
        log.info('JQDataTools: securities data loaded from cache (csv).')
    else:
        # Cache not found. Just download it.

        securities_raw = jqdatasdk.get_all_securities(
            types=[
                'stock', 'fund', 'index', 'futures', 'conbond', 'etf', 'lof', 'fja', 'fjb', 
                'open_fund', 'bond_fund', 'stock_fund', 'QDII_fund', 'money_market_fund', 
                'mixture_fund', 'bjse', 'csi'
            ]
        ) # type: ignore
        
        os.makedirs(__cache_dir(), exist_ok=True)
        securities_raw.to_parquet(cache_file_parquet, engine='pyarrow')
        securities_raw.to_csv(cache_file_csv, encoding='utf-8')
        log.info(f'JQDataTools: secirities saved to {cache_file_parquet}')
        log.info(f'JQDataTools: secirities saved to {cache_file_csv}')
    
    __jqdata.load(securities_raw)




def init() -> bool:
    if not __auth():
        return False
    
    __get_all_securities()
    
    return True
