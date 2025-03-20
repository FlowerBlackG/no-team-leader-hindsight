"""
    Logging Tools


    created on 2025.3.20, Shanghai
"""

import colorama
import time


def plain(msg: str):  # Private. Don't use this from other modules.
    time_str = time.strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{time_str}] {msg}")


def info(msg: str):
    plain(msg)


def warn(msg: str):
    print(colorama.Fore.YELLOW, end='')
    plain(f'😠 {msg}')
    print(colorama.Style.RESET_ALL, end='')



def debug(msg: str):
    print(colorama.Fore.LIGHTBLUE_EX, end='')
    plain(f'{msg}')
    print(colorama.Style.RESET_ALL, end='')


def error(msg: str):
    print(colorama.Fore.RED, end='')
    plain(f'😡 {msg}')
    print(colorama.Style.RESET_ALL, end='')

