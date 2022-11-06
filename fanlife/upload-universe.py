import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
import sys
from datetime import date
from time import time

today = date.today()
d1 = today.strftime("%d.%m.%Y")

def main() -> None:
    cred = credentials.Certificate("fanlife-private-creds.json")
    firebase_admin.initialize_app(cred, {'projectId': 'fanlife'})
    db = firestore.client()
    
    print(f"Running upload script on {len(sys.argv)-1} file(s)...")
    start_time = time()

    for ind, file in enumerate(sys.argv[1:]):
        if not file.endswith(".json"):
            print(f"Skipping file {ind+1}/{len(sys.argv)}, not of type .json.")
            continue
        print(f"Uploading file {ind+1}/{len(sys.argv)}...", end=' ')
        # Uploading process
        with open(file) as json_file:
            collectionName = file.split('.')[0]
            f = open(file, 'r')
            docs = json.load(json_file)
            for doc in docs:
                print(doc)
                exit()
                id = doc.pop('id', None)
                if id:
                    db.collection(collectionName).document(id).set(doc, merge=True)
                else:
                    db.collection(collectionName).add(doc)
            
        print("Done!")

    print(f"All done! Took {round((time()-start_time)*1000)} ms.")


    
    

if __name__ == '__main__':
    if len(sys.argv) == 1:
        print("Must supply at least one file argument!")
    else:
        main()