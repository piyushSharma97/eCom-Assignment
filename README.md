# Combo Shop (MERN practical)

Product listing, product detail, and **two-product combos** with an extra discount. Guest cart and a **demo checkout** (no real payment).

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React (Vite)

## Pricing

- Unit price = `discountedPrice` if set, otherwise `mainPrice`
- Combo of exactly two products: extra `%` off the sum of unit prices

## Run

MongoDB must be running locally (default `mongodb://127.0.0.1:27017/ecommerceStore`).

```sh
# Backend
cd Assignment/eComBackend
copy .env.example .env
npm install
npm run seed
npm run dev

# Frontend (another terminal)
cd Assignment/eComFrontend
npm install
npm run dev
```

- API: http://localhost:4380
- UI: http://localhost:5173

`npm test` in the backend folder runs combo pricing checks.

## Demo payment

Checkout **Pay now** creates an order and marks it paid. Nothing is charged. Cart is cleared for that browser session (`x-session-id` in `localStorage`).
