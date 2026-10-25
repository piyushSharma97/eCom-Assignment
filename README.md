# Combo Shop (MERN practical)

Product listing, product detail, and **two-product combos** with an extra discount. Guest cart and a **demo checkout** (no real payment).

## One command (local)

Needs **Node.js 18+** and **Docker** (for MongoDB).

```sh
cd eCom-Assignment
npm install
npm run dev
```

That starts Mongo, the API, and the React app:

- UI: http://localhost:5173
- API: http://localhost:4380

Stop with `Ctrl+C`. Catalog seed runs automatically if the database is empty (`SEED_ON_START=true`).

## One command (deployable)

Builds the React app into the API and serves **everything on port 4380**:

```sh
npm run deploy
```

Open http://localhost:4380

Stop with `docker compose down`.

## Other scripts

| Command | What it does |
|---------|----------------|
| `npm run mongo` | Start only Mongo in Docker |
| `npm run seed` | Reset products and combos |
| `npm start` | Production-style: build frontend, run Express (needs Mongo on 27017) |
| `npm test` | Combo pricing checks |

Copy `Assignment/eComBackend/.env.example` to `.env` if you need to change Mongo URI or port.

## Pricing

- Unit price = `discountedPrice` if set, otherwise `mainPrice`
- Combo of exactly two products: extra `%` off the sum of unit prices

## Demo payment

Checkout **Pay now** creates an order and marks it paid. Nothing is charged.
