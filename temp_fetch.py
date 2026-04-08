import requests
u='https://bhavyasabari2853-crypto.github.io/WE-DEV-FINAL/'
r=requests.get(u, timeout=10)
print('root', r.status_code)
print(r.text[:400])
# check script URL present
print('script present?', 'raw.githubusercontent.com' in r.text)
