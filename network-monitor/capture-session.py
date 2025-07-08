#!/usr/bin/env python3

"""
 Network monitoring using Charles.

 The purpose of this script is to run Charles headless, record a session,
 save it, and capture useful network information from it. This information is then
 automatically uploaded to Confluence so it can be compared with previous releases.
 The information can be used to check if the app is making
 more or larger requests that expected, if there are duplicate requests, etc.

 Usage:

 To run Charles and start recording:
 python3 scripts/network_monitoring/capture-session.py --start

 To save the current session, collect useful information, and upload it to Splunk:
 python3 scripts/network_monitoring/capture-session.py --stop-and-upload --appVer [appver] --flow [test case] 

 To retry sending session to Splunk:
 python3 scripts/network_monitoring/capture-session.py --retry-to-splunk

 RUNNING R2 Tests with Network Monitor

 RUN: 
"""
import argparse
import haralyzer
import json
import os
import requests
import splunk
import subprocess
import sys
import time

verbose: bool = False

def main(arguments):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--start', action='store_true', default=False, help="Run Charles and start recording session")
    parser.add_argument('--stop-and-upload', action='store_true', default=False, help="Save current session, stop recording, kill Charles, and upload results to Confluence")
    parser.add_argument('--retry-to-splunk', action='store_true', default=False, help="Retry uploading network logs to Splunk")
    parser.add_argument('--verbose', '-v', action='store_true', default=False, help='Verbose logging. (default: False)')
    parser.add_argument('--appVer', help='Provide which app version is being tested', type=float)
    parser.add_argument('--flow', help='Provide which app version is being tested')
    args = parser.parse_args(arguments)

    global verbose
    global appVer
    global flow
    verbose = args.verbose

    debug_print(f'Running network monitoring')

    create_session()
    
    if args.start:
        start()
    elif args.stop_and_upload:
        if args.appVer and args.flow:
            appVer = args.appVer
            flow = args.flow
            stop_and_upload()
        else:
            print("Please provide an appVersion and test flow name")
    elif args.retry_to_splunk:
        if args.appVer and args.flow:
            appVer = args.appVer
            flow = args.flow
            upload_session()

def create_session():
    proxies = {
        'http': 'http://192.168.0.37:8888',
        'https': 'http://192.168.0.37:8888',
    }
    global session
    session = requests.Session()
    session.proxies.update(proxies)

def start():
    debug_print('Will run Charles and start recording session')
    p = subprocess.Popen(['Charles', '-headless'])
    debug_print(f'Charles started with pid {p.pid}')
    time.sleep(5) # waiting until Charles is ready
    response = session.get('http://control.charles/recording/start')
    response.raise_for_status()
    if response.status_code == 200:
        debug_print(f'Started recording session')

def stop_and_upload():
    debug_print(f'Will stop recording session, kill Charles, and upload results')
    stop_and_save()
    upload_session()

def stop_and_save():
    response = session.get('http://control.charles/session/download')
    response.raise_for_status()
    if response.status_code == 200:
        debug_print(f'Saved recorded session')
    with open("session.chls", "wb") as file:
        file.write(response.content)
    response = session.get('http://control.charles/recording/stop')
    response.raise_for_status()
    if response.status_code == 200:
        debug_print(f'Stopped recording session')
    har_file_name = 'session.har' 
    if os.path.exists(har_file_name):
        os.remove(har_file_name)
    ret = subprocess.run(['Charles', 'convert', 'session.chls', har_file_name])
    debug_print(ret)
    if os.path.exists(har_file_name):
        debug_print(f'Created HAR file')
    ret = subprocess.run(f'killall Charles', shell=True, check=True)
    debug_print(ret)

def upload_session():
    with open('session.har', 'r') as f:
        har_data = json.loads(f.read())
    entries_data = har_data['log']['entries']
    entries = list(map(lambda entry_data: haralyzer.HarEntry(entry=entry_data), entries_data))
    debug_print(f'Reading {len(entries)} from HAR file')

    response = splunk.upload_to_splunk(entries, appVer, flow)
    if response.status_code == 200:
        debug_print('DONE: Logs sent to Splunk')
    else:
        debug_print('FAILD: Not able to send logs to Splunk')

def debug_print(text: str):
    if verbose:
        print(text)


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
