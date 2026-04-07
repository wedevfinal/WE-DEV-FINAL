import requests,json
base='http://127.0.0.1:8000'
cred={'email':'bh@email.in','password':'12345678'}
# login
r=requests.post(base+'/auth/login', json=cred, timeout=10)
print('login', r.status_code)
j=r.json()
print(j)
token=j.get('access_token')
headers={'Authorization':f'Bearer {token}'}
# get achievements
r2=requests.get(base+'/achievements', headers=headers, timeout=10)
print('/achievements', r2.status_code)
print(json.dumps(r2.json(), indent=2))
ach = r2.json().get('achievements', [])
if ach:
    first_locked = next((a for a in ach if not a.get('unlocked')), None)
    if first_locked:
        aid = first_locked['id']
        print('unlocking', aid)
        r3=requests.post(f"{base}/achievements/{aid}/unlock", headers=headers, timeout=10)
        print('unlock status', r3.status_code)
        print(json.dumps(r3.json(), indent=2))
