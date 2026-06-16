import requests
url='http://localhost:8000/api/generate'
payload={"genre":"Classical","bpm":90,"length_seconds":10,"creativity":0.5,"instrument":"piano","num_notes":64}
resp=requests.post(url,json=payload)
print('status',resp.status_code)
try:
    print(resp.json())
except Exception as e:
    print(resp.text)
