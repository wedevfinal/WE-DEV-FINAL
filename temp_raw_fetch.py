import requests
u='https://raw.githubusercontent.com/bhavyasabari2853-crypto/WE-DEV-FINAL/main/docs/index.html'
r=requests.get(u, timeout=10)
print(r.status_code)
print('raw contains raw.githubusercontent?', 'raw.githubusercontent.com' in r.text)
print(r.text[:400])
