import requests, json
r = requests.get("http://127.0.0.1:8000/ai/market-data", timeout=10)
print(json.dumps(r.json(), indent=2))
