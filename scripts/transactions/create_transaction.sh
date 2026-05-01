curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -d '{"accountId":"acct_1234abcd","amount":100,"merchant":"Test Store","category":"groceries","transactionType":"expense","date":"2026-04-30T00:00:00Z","source":"manual","createdAt":"2026-04-30T00:00:00Z"}'