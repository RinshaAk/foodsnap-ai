# FoodSnap AI Backend

Backend-only API for FoodSnap AI. It analyzes food photos with Gemini, estimates calories/macros/portion size, supports multiple visible items, and stores authenticated scan history in MongoDB.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Required `.env` values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
USDA_API_KEY=optional_usda_fooddata_central_api_key
```

`USDA_API_KEY` is optional. Without it, the API uses Gemini estimates only.

## Endpoints

### Health

```txt
GET /
```

### Register

```txt
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login

```txt
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Use the returned token in protected routes:

```txt
Authorization: Bearer YOUR_TOKEN
```

### Analyze Food

```txt
POST /api/food/analyze
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data
```

Form field:

```txt
image=<jpg|jpeg|png|webp food image>
```

Successful scans are saved to the logged-in user's history.

### History

```txt
GET /api/history
GET /api/history/:id
DELETE /api/history/:id
```

All history routes require `Authorization: Bearer YOUR_TOKEN`.
