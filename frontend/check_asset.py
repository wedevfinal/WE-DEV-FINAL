import requests
u='https://bhavyasabari2853-crypto.github.io/WE-DEV-FINAL/assets/index-BB5gLMm9.js'
for i in range(3):
    r=requests.get(u, timeout=10)
    print(i, r.status_code)
    if r.status_code==200:
        print('len', len(r.text))
        break
