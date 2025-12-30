# Mini User Management System

## Overview

This is a small MERN stack project for user management with roles and permissions. I made it for an interview task. The app lets users signup, login, update profile, and admins can manage users. Had some issues with CORS, Tailwind setup, and mobile connectivity during deployment, but fixed them after some struggle.

## Tech Stack

- MongoDB Atlas
- Express.js
- React (Vite)
- Node.js
- Tailwind CSS
- JWT, bcryptjs
- Render (backend deploy)
- Vercel (frontend deploy)

## Setup Instructions

### Backend

1. Go to `Backend/`
2. Run `npm install`
3. Setup `.env` file (see below)
4. Run `npm start`

### Frontend

1. Go to `Frontend/`
2. Run `npm install`
3. Setup `.env` file (see below)
4. Run `npm run dev`

## Environment Variables (do not share values)

**Backend:**

- MONGO_URI
- JWT_SECRET
- FRONTEND_URL

**Frontend:**

- VITE_API_URL

## Deployment & URLs

- **Frontend (Vercel):** https://mini-user-management-system-zeta.vercel.app
- **Backend (Render):** https://mini-user-management-system-bnaq.onrender.com

- Backend: Deploy to Render, set env vars in dashboard
- Frontend: Deploy to Vercel, set VITE_API_URL in dashboard
- Make sure both use HTTPS and public URLs

## API Documentation

```http
POST /api/auth/signup
{
  "fullName": "Test User",
  "email": "test@email.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

```json
{
  "success": true,
  "message": "Account created successfully!"
}
```

## API Documentation

### Auth

- **POST /api/auth/signup**

  - Signup new user
  - Body: `{ fullName, email, password, confirmPassword }`
  - Response: `{ success, message }`

- **POST /api/auth/login**
  - Login user
  - Body: `{ email, password }`
  - Response: `{ success, token, user }`

### User

- **GET /api/users/me**

  - Get current user profile (auth required)
  - Response: `{ user }`

- **PATCH /api/users/me**
  - Update profile (name, email, password; auth required)
  - Body: `{ fullName?, email?, currentPassword?, newPassword? }`
  - Response: `{ success, message, user }`

### Admin

- **GET /api/users**

  - Get all users (admin only)
  - Response: `{ users, pagination }`

- **PATCH /api/users/:id/activate**

  - Activate user (admin only)
  - Response: `{ success, message }`

- **PATCH /api/users/:id/deactivate**
  - Deactivate user (admin only)
  - Response: `{ success, message }`

## Notes

- Faced CORS error, fixed by setting correct origin in backend
- Tailwind CSS not working at first, had to reinstall and fix config
- Mobile couldn't connect to backend, was network issue and wrong API URL
- Commit history is messy, sorry for that :)
- If you see any bug, just refresh or check your env vars

---

Thanks for checking my project! If you need more info, ping me.
