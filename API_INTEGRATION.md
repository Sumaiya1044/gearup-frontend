# GearUp Frontend - API Integration

## Backend API

Local:
http://localhost:5000/api

Production:
https://gearup-backend-8d3n.onrender.com/api

## Authentication

The frontend uses JWT authentication.

After login, the JWT token is stored in `localStorage` as:

token

Axios automatically sends the token with protected API requests using:

Authorization: Bearer <token>

## Customer APIs

### Authentication
- POST /auth/register
- POST /auth/login

### Gear
- GET /gear
- GET /gear/:id
- GET /categories

### Rentals
- POST /rentals
- GET /rentals
- GET /rentals/:id
- PATCH /rentals/:id/status
- GET /rentals/provider/orders

### Payment
- POST /payments/initiate

### Reviews
- POST /reviews
- GET /reviews/gear/:gearItemId

## Provider APIs

- GET /gear/provider/my-gear
- POST /gear
- PUT /gear/:id
- DELETE /gear/:id
- GET /rentals/provider/orders
- PATCH /rentals/:id/status

## Admin APIs

- GET /admin/users
- PATCH /admin/users/:id
- GET /admin/gear
- GET /admin/rentals

## Frontend API Client

All API requests are handled through:

src/lib/api.ts

The API client uses the `NEXT_PUBLIC_API_URL` environment variable.

## Environment Variable

Create `.env.local`:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

For production, replace the value with the deployed backend API URL.

## Roles

The application supports three roles:

- CUSTOMER
- PROVIDER
- ADMIN

Protected dashboard pages and actions are controlled according to the authenticated user's role.

## Payment Flow

1. Customer creates a rental.
2. Frontend initiates payment.
3. Backend creates the SSLCommerz payment session.
4. Customer completes payment in the sandbox gateway.
5. Payment success/cancel redirects back to the frontend.
6. Rental and payment status are updated by the backend.

## Error Handling

The frontend displays user-friendly messages for API failures and authentication errors.

Loading states are shown while API data is being fetched or submitted.
