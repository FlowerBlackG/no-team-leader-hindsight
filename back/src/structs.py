"""
    sturcts

    for this small project, define all structs inside one file is enough.

    created on 2025.3.20, Shanghai
"""

import enum

class MinuteMarketData:
    def __init__(self):
        self.security_id = ''
        self.datetime = ''
        self.pre_close_price = 0.0
        self.open_price = 0.0
        self.high_price = 0.0
        self.low_price = 0.0
        self.last_price = 0.0
        self.volume = 0
        self.amount = 0.0
        self.iopv = 0.0
        self.fp_volume = 0
        self.fp_amount = 0.0
        self.avg_price = 0.0
        self.minute_num = 0
        self.trading_day = ''
        
        

class InstrumentInfo:
    def __init__(self):
        self.id = str()
        self.display_name = str()
        self.inst_type = str()


