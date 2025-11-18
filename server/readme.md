# 🚀 Riara HelpBot – Backend API

A **Node.js + Express** backend powering an intelligent FAQ chatbot for Riara University.  
Features include **semantic search using embeddings**, **admin authentication**, **FAQ management**, and **chat analytics**.

---

<div align="center">
  
### 🛠️ Tech Stack

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,js,github,postman" />

</div>

---

## ✨ Features

### 🔐 Admin System

- JWT Authentication
- Protected Admin Routes
- Create / Update / Delete FAQs
- Create the first admin without authentication

### 🤖 Intelligent Chatbot

- Uses **HuggingFace sentence embeddings**
- Cosine similarity matching
- Confidence-based fallback responses
- Fast & lightweight

### 📊 Chat Analytics

- Track total chats
- Top 5 most frequently asked FAQs
- Logs stored in MongoDB

### ❤️ System Health

- `/api/health` endpoint to verify server uptime

---

## 📁 Project Structure

```bash
server/
├── lib/
│   └── db.js              # Database connection
├── middleware/
│   └── auth.js            # JWT protection
├── routes/
│   ├── admin.js
│   ├── chat.js
│   ├── faqs.js
│   └── health.js
├── services/
│   └── huggingface.js     # Embedding generator
├── server.js
└── .env
```

---

## Installation

### Install dependencies

```bash
npm install
```

### Create `.env` file

```
PORT=5000
MONGO_URI="your_mongodb_url"
MONGO_DB=riara-helpbot

# HuggingFace
HF_TOKEN=hf_your_token
HUGGINGFACE_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Admin Auth
JWT_SECRET=
```

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste it into `JWT_SECRET=`.

### 4️⃣ Start development server

```bash
npm run dev
```

---

## 🌐 API Endpoints

### 🟢 Public Endpoints

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| GET    | `/api/health`       | Check API health      |
| POST   | `/api/admin/create` | Create first admin    |
| POST   | `/api/admin/login`  | Login & get JWT token |
| POST   | `/api/chat`         | Chat with the bot     |

---

### 🔒 Protected Admin Endpoints

**Requires:**  
`Authorization: Bearer <token>`

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| POST   | `/api/admin/register`  | Create new admin    |
| GET    | `/api/admin/analytics` | View chat analytics |
| GET    | `/api/faqs`            | Get all FAQs        |
| POST   | `/api/faqs`            | Add FAQ             |
| PUT    | `/api/faqs/:id`        | Update FAQ          |
| DELETE | `/api/faqs/:id`        | Delete FAQ          |

---

## 🧪 Postman Collection

Use this collection to test all endpoints easily:

**Postman Collection:**  
[Open postman collection link](https://web.postman.co/workspace/My-Workspace~e1539efe-a7e1-4d9b-83f1-65c3c5d6bdab/collection/36348178-f654fef6-f253-45da-9281-54b4f7d0087e?action=share&source=copy-link&creator=36348178)

---

## 🔑 Authentication Guide (Postman)

### 1. Login

```json
POST /api/admin/login
{
  "username": "admin",
  "password": "password"
}
```

### 2. Copy JWT Token

From the response:

```json
{ "token": "<your_jwt_token>" }
```

### 3. Add this header to protected routes:

```
Authorization: Bearer <your_token>
```

---

## 💬 Testing the Chatbot

Send:

```http
POST /api/chat
```

Body:

```json
{
  "message": "What are the library opening hours?"
}
```

Expected Response:

```json
{
  "response": {
    "text": "The library is open from ...",
    "question": "Library opening hours"
  },
  "confidence": 0.89
}
```

## 📄 License

MIT License — free to modify and use.

❤️ **Happy Coding!**  
Feel free to extend the bot with more intelligence, better logs, or additional services.
