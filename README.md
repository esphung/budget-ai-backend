# BudgetAI Backend

A local Node.js/Express REST API that powers the BudgetAI personal finance assistant. It provides CRUD endpoints for accounts and transactions, an OpenAI-backed chat assistant that can parse natural-language expense entries and trigger app actions, and Plaid integration for bank account linking.

---

## Table of Contents

* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
  + [Prerequisites](#prerequisites)
  + [Installation](#installation)
  + [Environment Variables](#environment-variables)
  + [Running the Server](#running-the-server)
* [API Reference](#api-reference)
  + [System](#system)
  + [Accounts](#accounts)
  + [Transactions](#transactions)
  + [OpenAI](#openai)
  + [Plaid](#plaid)
* [Database](#database)
* [Testing](#testing)
* [Shell Scripts](#shell-scripts)
* [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 4 |
| Database | SQLite 3 (via `sqlite` / `sqlite3` ) |
| AI | OpenAI Chat Completions API |
| Bank linking | Plaid |
| Logging | Morgan + tslog |
| Testing | Jest + ts-jest + Supertest |

---

## Project Structure

```
src/
├── index.ts                  # App entry point — wires DB, routers, middleware
├── controllers/
│   ├── AbstractController.ts
│   ├── DatabaseController.ts
│   ├── AccountsController.ts
│   └── TransactionsController.ts
├── repositories/
│   ├── AccountRepository.ts
│   └── TransactionRepository.ts
├── routes/
│   ├── accountsRouter.ts
│   ├── transactionsRouter.ts
│   ├── openAiRouter.ts
│   ├── plaidRouter.ts
│   └── publicRouter.ts       # Serves /, /openapi.json, /docs
├── services/
│   ├── databaseService.ts    # Opens SQLite connection and runs migrations
│   ├── env.ts                # Validated environment config
│   ├── openAiService.ts      # OpenAI singleton client
│   ├── openApiSpec.ts        # OpenAPI 3.0 spec (served at /openapi.json)
│   └── responseFormat.ts     # JSON schema for structured AI responses
├── types/
│   ├── Account.ts
│   ├── Transaction.ts
│   ├── BaseRepository.ts
│   └── openai.ts
├── usecases/
│   └── RunMigrations.ts      # Creates all tables on startup
├── middleware/
│   └── jsonErrorHandler.ts
└── utils/
    ├── ErrorTools.ts
    └── RandomUtils.ts

scripts/
├── accounts/                 # curl helpers for the Accounts API
└── transactions/             # curl helpers for the Transactions API
```

---

## Getting Started

### Prerequisites

* Node.js ≥ 20
* Yarn (v4 — the repo uses Yarn Berry)
* A Plaid developer account (sandbox keys are free)
* An OpenAI API key

### Installation

```bash
git clone <repo-url>
cd budget-ai-backend
yarn install
```

`postinstall` compiles TypeScript and rebuilds the native `sqlite3` binary automatically.

### Environment Variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3001` | Port the server listens on |
| `PLAID_CLIENT_ID` | Yes | — | Plaid client ID |
| `PLAID_SECRET` | Yes | — | Plaid secret |
| `PLAID_ENV` | No | `sandbox` | Plaid environment ( `sandbox` / `development` / `production` ) |
| `OPENAI_API_KEY` | Yes | — | OpenAI API key |
| `OPENAI_BASE_URL` | No | `https://api.openai.com/v1` | OpenAI-compatible base URL |
| `OPENAI_MODEL` | No | `gpt-4.1-nano` | Model used for chat completions |

### Running the Server

```bash
# Development (hot-reload via nodemon)
yarn dev

# Production (compile then run)
yarn build
yarn start
```

The server starts at **http://localhost:3001**.

Interactive API docs are available at **http://localhost:3001/docs** (Swagger UI).
The raw OpenAPI 3.0 spec is served at **http://localhost:3001/openapi.json**.

---

## API Reference

### System

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ status: "ok" }` |
| `GET` | `/` | API overview with endpoint list |
| `GET` | `/openapi.json` | OpenAPI 3.0 spec document |
| `GET` | `/docs` | Swagger UI |

---

### Accounts

| Method | Path | Description |
|---|---|---|
| `GET` | `/accounts` | List all accounts |
| `POST` | `/accounts` | Create an account |
| `PUT` | `/accounts/:id` | Update an account |
| `DELETE` | `/accounts/:id` | Delete an account |
| `DELETE` | `/accounts/all` | Delete all accounts |

**Account object**

```json
{
  "id": "acct_abc123",
  "name": "Primary Checking",
  "accountType": "checking",
  "currency": "USD",
  "createdAt": "2026-04-30T00:00:00.000Z",
  "updatedAt": "2026-04-30T00:00:00.000Z"
}
```

`accountType` must be one of: `cash` | `checking` | `savings` | `credit` | `investment` | `other`

**Create / update request body**

```json
{
  "name": "Primary Checking",
  "accountType": "checking",
  "currency": "USD"
}
```

---

### Transactions

| Method | Path | Description |
|---|---|---|
| `GET` | `/transactions` | List all transactions |
| `POST` | `/transactions` | Create a transaction |
| `PUT` | `/transactions/:id` | Update a transaction |
| `DELETE` | `/transactions/:id` | Delete a transaction |
| `DELETE` | `/transactions/all` | Delete all transactions |

**Transaction object**

```json
{
  "id": "txn_abc123",
  "accountId": "acct_abc123",
  "amount": 42.50,
  "merchant": "Whole Foods",
  "category": "groceries",
  "transactionType": "expense",
  "date": "2026-04-30T00:00:00.000Z",
  "source": "manual",
  "createdAt": "2026-04-30T00:00:00.000Z"
}
```

`transactionType` must be one of: `expense` | `income` | `transfer`

`source` must be one of: `ai` | `manual`

**Create request body**

```json
{
  "amount": 42.50,
  "merchant": "Whole Foods",
  "category": "groceries",
  "transactionType": "expense",
  "date": "2026-04-30T00:00:00.000Z",
  "source": "manual"
}
```

---

### OpenAI

| Method | Path | Description |
|---|---|---|
| `POST` | `/openai/send-message` | Send a chat message to the AI assistant |

**Request body**

```json
{
  "messages": [
    { "role": "user", "content": "I spent $42 at Whole Foods today" }
  ]
}
```

**Response**

The assistant returns a structured JSON response that includes a human-readable message and an optional list of actions the client should execute:

```json
{
  "message": "Got it! I've logged a $42 expense at Whole Foods.",
  "actions": [
    {
      "type": "save_transaction",
      "payload": {
        "amount": 42,
        "merchant": "Whole Foods",
        "category": "groceries",
        "transaction_type": "expense",
        "date": "2026-04-30"
      }
    }
  ]
}
```

Supported action types: `save_transaction` | `navigate` | `logout`

---

### Plaid

| Method | Path | Description |
|---|---|---|
| `GET` | `/plaid/link-token` | Create a Plaid Link token to initiate account linking |
| `POST` | `/plaid/exchange-token` | Exchange a Plaid public token for an access token |

---

## Database

The app uses a local SQLite file ( `database.db` ) created in the project root on first start. Migrations run automatically at startup via `RunMigrations` .

**Tables**

| Table | Purpose |
|---|---|
| `accounts` | Financial accounts (checking, savings, etc.) |
| `transactions` | Individual income/expense/transfer records |
| `users` | User records |
| `ai_threads` | OpenAI conversation threads |
| `ai_messages` | Messages within AI threads |
| `ai_actions` | Actions proposed/applied by the AI assistant |
| `categories` | Spending categories |
| `budgets` | Budget definitions per category and period |

The database file is excluded from version control via `.gitignore` .

---

## Testing

```bash
# Run all tests
yarn test

# Run with coverage report
yarn test:coverage
```

Tests are co-located with source files ( `*.test.ts` ) and use:
* **Jest** + **ts-jest** for TypeScript test execution
* **Supertest** for HTTP endpoint integration tests
* In-memory SQLite for migration tests

Coverage is reported to the `coverage/` directory.

---

## Shell Scripts

Convenience `curl` scripts for manual API testing are provided under `scripts/` .

```
scripts/
├── accounts/
│   ├── get_all_accounts.sh
│   ├── create_account.sh       <name> <accountType> [currency]
│   ├── update_account.sh       <id> <name> <accountType> [currency]
│   ├── delete_account.sh       <id>
│   ├── clear_accounts.sh
│   └── smoke_test_accounts.sh  [accountType] [currency]
└── transactions/
    ├── list_transactions.sh
    ├── create_transaction.sh
    ├── update_transaction.sh
    ├── delete_transaction.sh
    ├── clear_transactions.sh
    └── smoke_test_transactions.sh  [amount] [updatedAmount]
```

All scripts default to `BASE_URL=http://localhost:3001` . Override with:

```bash
BASE_URL=https://my-deployed-api.com scripts/accounts/get_all_accounts.sh
```

Run full end-to-end CRUD smoke tests:

```bash
scripts/accounts/smoke_test_accounts.sh
scripts/transactions/smoke_test_transactions.sh
```

---

## Deployment

The project includes configuration for both **Heroku** and **Render**.

```bash
# Heroku build hook (runs automatically on deploy)
yarn heroku-postbuild   # compiles TypeScript

# Start command
yarn start              # runs dist/index.js
```

Ensure all required environment variables are set in your deployment platform's config before deploying.
