# WayFair API Documentation

## Base URL
```
https://api.wayfair.com/v1
```

## Authentication
All endpoints require Bearer token in Authorization header
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/verify-email` - Verify email address
- `POST /auth/reset-password` - Reset password

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `GET /users/:id` - Get user details
- `POST /users/documents` - Upload documents
- `GET /users/:id/rating` - Get user rating

### Rides
- `GET /rides/search` - Search rides
- `POST /rides` - Create ride
- `GET /rides/:id` - Get ride details
- `POST /rides/:id/book` - Book ride
- `POST /rides/:id/start` - Start ride
- `POST /rides/:id/end` - End ride
- `POST /rides/:id/cancel` - Cancel ride
- `POST /rides/:id/rate` - Rate ride/user

### Bookings
- `GET /bookings` - Get user bookings
- `GET /bookings/:id` - Get booking details
- `POST /bookings/:id/cancel` - Cancel booking
- `POST /bookings/:id/pay` - Process payment

### Payments
- `POST /payments` - Process payment
- `GET /payments/:id` - Get payment details
- `GET /payments/history` - Get payment history
- `POST /payments/:id/refund` - Refund payment

### Chat
- `POST /chat/:rideId/send` - Send message
- `GET /chat/:rideId/messages` - Get messages
- `GET /chat/conversations` - Get conversations

### Blockchain
- `GET /blockchain/data` - Get blockchain stats
- `GET /blockchain/rides/:id/transaction` - Get ride transaction
- `GET /blockchain/transactions` - Get all transactions

### Admin
- `GET /admin/users` - List all users
- `POST /admin/users/:id/block` - Block user
- `POST /admin/users/:id/unblock` - Unblock user
- `POST /admin/documents/verify` - Verify documents
- `GET /admin/reports` - Get reports
- `POST /admin/reports/:id/resolve` - Resolve report

## Error Codes
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Internal Server Error

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": ""
}
```
