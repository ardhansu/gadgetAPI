# 🕶️ IMF Gadget API

Welcome to the Impossible Missions Force (IMF) Gadget Management API! This secure API allows authorized IMF personnel to manage the organization's high-tech gadget inventory.

## 🎯 Mission Overview

This API provides secure endpoints for:
- Managing gadget inventory (CRUD operations)
- Triggering self-destruct sequences
- Authentication and authorization
- Random mission success probability calculations
- Unique codename generation

## 🔧 Tech Stack

- **Node.js** with Express.js
- **PostgreSQL** with Prisma ORM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for validation
- **Helmet** for security headers
- **Rate limiting** for API protection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

4. Initialize database:
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. Seed the database (optional):
   ```bash
   node prisma/seed.js
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

## 🔐 Authentication

All API endpoints (except auth routes) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Test Users

If you ran the seed script, you can use these test accounts:

- **Admin**: `admin@imf.gov` / `admin123456`
- **Handler**: `handler@imf.gov` / `handler123456`
- **Agent**: `agent@imf.gov` / `agent123456`

## 📚 API Endpoints

### Authentication

#### POST /api/auth/register
Register a new IMF agent.

**Request:**
```json
{
  "email": "agent@imf.gov",
  "password": "securepassword123",
  "role": "AGENT"
}
```

#### POST /api/auth/login
Authenticate an agent.

**Request:**
```json
{
  "email": "agent@imf.gov",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Mission successful: Agent authenticated",
  "token": "jwt-token-here",
  "agent": {
    "id": "uuid",
    "email": "agent@imf.gov",
    "role": "AGENT"
  }
}
```

### Gadget Management

#### GET /api/gadgets
Retrieve all gadgets with mission success probabilities.

**Query Parameters:**
- `status` (optional): Filter by status (AVAILABLE, DEPLOYED, DESTROYED, DECOMMISSIONED)

**Response:**
```json
{
  "message": "Mission successful: Gadget inventory retrieved",
  "count": 5,
  "gadgets": [
    {
      "id": "uuid",
      "name": "Explosive Gum",
      "codename": "The Nightingale",
      "description": "Chewing gum that explodes with the force of a grenade",
      "status": "AVAILABLE",
      "missionSuccessProbability": "87%",
      "createdAt": "2023-12-01T00:00:00Z",
      "updatedAt": "2023-12-01T00:00:00Z"
    }
  ]
}
```

#### GET /api/gadgets/:id
Retrieve a specific gadget.

#### POST /api/gadgets
Create a new gadget (requires HANDLER or ADMIN role).

**Request:**
```json
{
  "name": "Sonic Screwdriver",
  "description": "Multi-tool that can unlock doors and disable electronics"
}
```

#### PATCH /api/gadgets/:id
Update a gadget (requires HANDLER or ADMIN role).

**Request:**
```json
{
  "name": "Updated Gadget Name",
  "status": "DEPLOYED"
}
```

#### DELETE /api/gadgets/:id
Decommission a gadget (requires HANDLER or ADMIN role).

This performs a soft delete by marking the gadget as DECOMMISSIONED and setting a timestamp.

### Self-Destruct

#### POST /api/gadgets/:id/self-destruct
Trigger self-destruct sequence (requires HANDLER or ADMIN role).

**Response:**
```json
{
  "message": "Mission successful: Self-destruct sequence activated",
  "confirmationCode": "ABC123",
  "gadget": {
    "id": "uuid",
    "name": "Explosive Gum",
    "status": "DESTROYED",
    "selfDestructActivated": true,
    "selfDestructAt": "2023-12-01T12:00:00Z"
  },
  "warning": "This gadget will self-destruct in 5 seconds..."
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permission levels (AGENT, HANDLER, ADMIN)
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Prevents API abuse
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **Soft Deletes**: Gadgets are decommissioned, not deleted

## 🎭 Role Permissions

- **AGENT**: Can view gadgets only
- **HANDLER**: Can view, create, update, and decommission gadgets
- **ADMIN**: Full access to all operations

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server with nodemon
- `npm run start`: Start production server
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:studio`: Open Prisma Studio

### Database Schema

The API uses the following models:

- **User**: IMF agents with authentication
- **Gadget**: Gadget inventory with status tracking

## 📊 API Response Format

All API responses follow a consistent format:

```json
{
  "message": "Mission status message",
  "data": "Response data",
  "error": "Error message (if applicable)"
}
```

## 🌐 Deployment

This API is designed to be deployed on platforms like:
- Heroku
- Render
- Railway
- DigitalOcean App Platform

Make sure to set all environment variables in your deployment platform.

## 🔍 Error Handling

The API includes comprehensive error handling for:
- Authentication errors
- Validation errors
- Database errors
- Rate limiting
- Not found errors

## 📝 License

CLASSIFIED - Property of the Impossible Missions Force

---

*This message will self-destruct in 5 seconds... 💥*