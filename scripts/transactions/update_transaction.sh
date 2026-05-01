DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

curl -X PUT http://localhost:3001/transactions/txn_4a4rk8iqf \
  -H "Content-Type: application/json" \
  -d "{\"amount\":150,\"merchant\":\"Updated Store\",\"date\":\"$DATE\"}"
