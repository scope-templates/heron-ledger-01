# Heron Ledger

A small ledger API. Entries are kept in memory, so the list resets whenever the process restarts.

## Running locally

```
npm install
SESSION_SECRET=change-me npm start
```

The API listens on port 3000.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `SESSION_SECRET` | yes | Key used to sign the session cookie. |

## Routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Liveness check, answers `{"ok":true}`. |
| `POST` | `/sessions` | Starts a session for `{"user":"ada"}` and sets the session cookie. |
| `GET` | `/entries` | Lists all entries. |
| `POST` | `/entries` | Records an entry: `{"account":"cash","amount":120.5,"memo":"invoice 1042"}`. |
