import json

FILE = open('config.json')
KEYS = json.load(FILE)

FILE.close()