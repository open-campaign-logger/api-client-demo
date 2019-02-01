from requests import Request, Session

token = 'tokenstring'

req = Request('POST', 'https://generator.campaign-logger.com/generate',
              files={'generator': (None, '{"resultPattern": "HALLO"}'), 'token': (None, token)})
prepped = req.prepare()

print(prepped.headers)
print(prepped.body)

s = Session()
resp = s.send(prepped)

print(resp.text)
