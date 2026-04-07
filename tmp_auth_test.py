import requests, json
base='http://127.0.0.1:8000'
cred={'email':'bh@email.in','password':'12345678'}
r=requests.post(base+'/auth/login', json=cred, timeout=10)
print('login status', r.status_code)
try:
    print(json.dumps(r.json(), indent=2))
    token = r.json().get('access_token')
except Exception as e:
    print('json error', e, r.text)
    token = None
if token:
    r2 = requests.get(base+'/auth/me', headers={'Authorization': f'Bearer {token}'}, timeout=10)
    print('\n/auth/me status', r2.status_code)
    try:
        print(json.dumps(r2.json(), indent=2))
    except:
        print(r2.text)
