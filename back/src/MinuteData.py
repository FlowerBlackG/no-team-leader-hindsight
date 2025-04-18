import os
import structs


def _data_folder() -> str:
    return f'{os.environ["VC_DATA_CACHE_DIR"]}/Minute'


def _path_of(date: str) -> str:
    return f'{_data_folder()}/{date}.csv'


minute_data: dict[str, list[structs.MinuteMarketData]] = {}

def _load_data():
    date = '20240430'
    with open(_path_of(date), 'r') as f:
        f.readline()  # Ignore first line.
        while True:
            line = f.readline()
            if line == -1:
                break
            line = line.replace('\r', '').replace('\n', '')
            if len(line) == 0:
                break

            line_segs = line.split(',')

            # Special thanks to Google Gemini 2.0 Flash.
            md = structs.MinuteMarketData()
            md.security_id = line_segs[0]
            md.datetime = line_segs[1]
            md.pre_close_price = float(line_segs[2])
            md.open_price = float(line_segs[3])
            md.high_price = float(line_segs[4])
            md.low_price = float(line_segs[5])
            md.last_price = float(line_segs[6])
            md.volume = int(line_segs[7])
            md.amount = float(line_segs[8])
            md.iopv = float(line_segs[9])
            md.fp_volume = int(line_segs[10])
            md.fp_amount = float(line_segs[11])
            md.avg_price = float(line_segs[12])
            md.minute_num = int(line_segs[13])
            md.trading_day = line_segs[14]

            if md.security_id not in minute_data:
                minute_data[md.security_id] = []

            minute_data[md.security_id].append(md)



def init() -> bool:
    _load_data()
    return True
