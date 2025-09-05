import json
import os
import plistlib
import sys
from json import JSONDecodeError


class WMFile:
    @staticmethod
    def write_content_to_file(content, filename, mode="w"):
        if isinstance(content, bytes):
            mode = "wb"

        with open(filename, mode) as f:
            if isinstance(content, (str, bytes)):
                f.write(content)
            elif isinstance(content, (dict, list)):
                f.write(json.dumps(content))
            else:
                print(f"Won't write content: {content}", file=sys.stderr)

    @staticmethod
    def read_content_from_file(filename):
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                return f.read()
        print(f" {filename} doesn't exist ")
        return ""

    @staticmethod
    def read_content_lines_from_file(filename):
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                return f.readlines()
        print(f" {filename} doesn't exist ")
        return []

    @staticmethod
    def read_json_content_from_file(filename):
        content = WMFile.read_content_from_file(filename)
        try:
            return json.loads(content)
        except JSONDecodeError as ex:
            print(f"Unable to read JSON content from {filename}: {ex}", file=sys.stderr)
        return None

    @staticmethod
    def read_plist_from_file(filename):
        if os.path.exists(filename):
            with open(filename, 'rb') as fp:
                try:
                    return plistlib.load(fp)
                except plistlib.InvalidFileException as ex:
                    print(f"Unable to read plist content from {filename}: {ex}", file=sys.stderr)
        return None

    @staticmethod
    def remove_file(filename):
        if os.path.isfile(filename):
            os.remove(filename)

