# Riara HelpBot – Backend API

A Node.js + Express backend powering an intelligent FAQ chatbot for Riara University, featuring embeddings-based search, admin authentication, FAQ management, and analytics.

<div align="center"> 
<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,js,github,postman" /> 
<p align="center">
TechStack
</p>
</div>

## Features

### Admin System

- admin login (JWT Auth)
- Protected Admin routes
- Add / Update / Delete FAQs

### Intelligent Chatbot

- Semantic Search `HuggingFace embeddings`
- Cosine similarity ranking
- Confidence-based fallback responses

### Chat Analytics

- Total chat count
- Most Asked FAQs
- Chat logging stored in `MongoDB`

### System Health

- `/api/health` endpoint for server uptime monitoring

## Project Structure

```bash
server/
├── lib/
│   └── db.js              # Database connection
├── middleware/
│   └── auth.js            # JWT middleware
├── routes/
│   ├── admin.js
│   ├── chat.js
│   ├── faqs.js
│   └── health.js
├── services/
│   └── huggingface.js     # Embeddings gen
├── server.js
└── .env
```

## Installation

1. Install dependencies

```bash
npm install
```

2. Create `.env` file
   Your `.env` must contain:

```bash
PORT=5000
MONGO_URI="your_mongodb_url"
MONGO_DB=riara-helpbot

# HuggingFace
HF_TOKEN=hf_your_token
HUGGINGFACE_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Admin
JWT_SECRET=
```

3. Generate a JWT Secret
   Run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output into JWT_SECRET=

4. Start your development server

```bash
npm run dev
```

## API Endpoints

### 🟢 Public Routes

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/health`       | Check server status |
| POST   | `/api/admin/create` | Create first admin  |
| POST   | `/api/admin/login`  | Login & receive JWT |
| POST   | `/api/chat`         | Chat with the bot   |

### 🔒 Protected Admin Routes

(**_Requires Authorization header_**)

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| POST   | `/api/admin/register`  | Register new admin  |
| GET    | `/api/admin/analytics` | View chat analytics |
| GET    | `/api/faqs`            | List all FAQs       |
| POST   | `/api/faqs`            | Add FAQ             |
| PUT    | `/api/faqs/:id`        | Update FAQ          |
| DELETE | `/api/faqs/:id`        | Delete FAQ          |

Use this Postman collection to test all endpoints easily:

**Postman Collection:**
[Open Link](https://web.postman.co/workspace/My-Workspace~e1539efe-a7e1-4d9b-83f1-65c3c5d6bdab/collection/36348178-f654fef6-f253-45da-9281-54b4f7d0087e?action=share&source=copy-link&creator=36348178)

## How to Authenticate (Postman)

1. Login using:

```json
POST /api/admin/login
{
  "username": "admin",
  "password": "password"
}
```

2. Copy the token from response

3. For protected routes add header:

```
Authorization: Bearer <your_token>
```

## Testing the Chatbot (Postman)

Send:

```
POST /api/chat
```

Body:

```json
{
  "message": "What are the library opening hours?"
}
```

Response:

```json
{
  "response": {
    "text": "The library is open from ...",
    "question": "Library opening hours"
  },
  "confidence": 0.89
}
```

❤️ Happy coding!
