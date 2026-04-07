import requests, json
key='ae0c2d8caa1d4e83818fa4b0291f4115'
endpoints = [
    ('top-headlines','https://newsapi.org/v2/top-headlines', {'category':'business','country':'in','apiKey':key}),
    ('everything','https://newsapi.org/v2/everything', {'q':'india finance','pageSize':5,'apiKey':key}),
]
for name,url,params in endpoints:
    try:
        r = requests.get(url, params=params, timeout=10)
        print('\n===', name, 'STATUS', r.status_code)
        # print a few common rate limit headers if present
        for h in ['X-RateLimit-Limit','X-RateLimit-Remaining','X-RateLimit-Reset','RateLimit-Limit','RateLimit-Remaining','Retry-After']:
            if h in r.headers:
                print(h+':', r.headers[h])
        j = r.json()
        print('json status:', j.get('status'))
        if j.get('status')=='error':
            print('code:', j.get('code'))
            print('message:', j.get('message'))
        else:
            print('totalResults:', j.get('totalResults'))
            print('articles returned:', len(j.get('articles',[])))
    except Exception as e:
        print('request failed:', str(e))
