# FoodSnap AI

FoodSnap AI is a MERN backend project that analyzes a food image with Gemini, estimates calories and macronutrients, and stores authenticated scan history in MongoDB.

This submission focuses on the backend API. The frontend scaffold exists, but the implemented requirements here are exposed through REST endpoints.

## Features

- Image upload API for food photos
- Gemini-powered food identification
- Calorie, protein, carbohydrate, and fat estimates
- Portion-size text estimate and estimated grams
- Multiple visible food item support
- Optional USDA FoodData Central nutrition refinement
- JWT authentication
- Auth-protected food scan history
- MongoDB Atlas persistence
- Fresh-clone safe uploads using in-memory Multer storage

## Tech Stack

- Node.js
- Express
- MongoDB and Mongoose
- Gemini API through `@google/genai`
- Multer for image upload parsing
- JWT and bcrypt for authentication
- Axios for optional USDA FoodData Central lookup

## Project Structure

```txt
backend/
  config/db.js
  controllers/
  middleware/
  models/
  routes/
  services/
frontend/
  Vite React scaffold only
```

## Environment Variables

Create `backend/.env` using `backend/.env.example`.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
USDA_API_KEY=optional_usda_fooddata_central_api_key
FRONTEND_URL=http://localhost:5173
INVITE_EMAIL_WEBHOOK_URL=
```

`USDA_API_KEY` is optional. If it is missing, the API still works with Gemini estimates.

## Run Locally

```bash
cd backend
npm install
npm run dev
```

Health check:

```bash
GET http://localhost:5000/
```

Expected response:

```json
{
  "success": true,
  "message": "FoodSnap AI API is running"
}
```

## API Usage

### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "password123"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "password123"
}
```

Use the returned token as:

```txt
Authorization: Bearer YOUR_TOKEN
```

### Analyze Food Image

```bash
POST /api/food/analyze
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

image=<food image file>
```

Successful responses include the nutrition estimate and `historyId`.

Example response shape:

```json
{
  "success": true,
  "message": "Food image analyzed successfully",
  "data": {
    "foodName": "Rice and chicken",
    "portionEstimate": "About one plate",
    "estimatedGrams": 350,
    "calories": 610,
    "protein": 34,
    "carbohydrates": 72,
    "fat": 18,
    "confidence": 0.78,
    "nutritionSource": "gemini_estimate",
    "items": [
      {
        "foodName": "Rice",
        "portionEstimate": "About 1 cup",
        "estimatedGrams": 180,
        "calories": 230,
        "protein": 4,
        "carbohydrates": 50,
        "fat": 1,
        "confidence": 0.8
      }
    ],
    "historyId": "mongo_document_id"
  }
}
```

### Get Scan History

```bash
GET /api/history
Authorization: Bearer YOUR_TOKEN
```

### Get Single History Item

```bash
GET /api/history/:id
Authorization: Bearer YOUR_TOKEN
```

### Delete History Item

```bash
DELETE /api/history/:id
Authorization: Bearer YOUR_TOKEN
```

## Requirement Status

- Image input: implemented through `POST /api/food/analyze`
- Food identification: implemented through Gemini
- Calorie estimation: implemented
- Macronutrient breakdown: implemented
- Portion-size consideration: implemented as visual estimate and estimated grams
- Multiple food items: implemented through `items`
- Saved history: implemented for authenticated scans
- Protected history routes: implemented with JWT middleware
- Upload folder issue: avoided with in-memory uploads
- Better nutrition accuracy: optional USDA FoodData Central refinement
- Frontend UI: intentionally not completed in this backend-only version

## Known Limitations

- Nutrition values are estimates and depend on image clarity, angle, lighting, and portion visibility.
- USDA refinement is optional and requires `USDA_API_KEY`.
- Portion size from a single image is approximate.
- No live demo link is included yet.
