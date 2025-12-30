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

## Environment Variables

**Backend:**

- MONGO_URI
- JWT_SECRET
- FRONTEND_URL

**Frontend:**

- VITE_API_URL

## Deployment

- Backend: Deploy to Render, set env vars in dashboard
- Frontend: Deploy to Vercel, set VITE_API_URL in dashboard
- Make sure both use HTTPS and public URLs

## API Documentation


- Example request (signup):

```http
POST /api/auth/signup
{
  "fullName": "Test User",
  "email": "test@email.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

- Example response:

```json
{
  "success": true,
  "message": "Account created successfully!"
}
```

## Notes

- Faced CORS error, fixed by setting correct origin in backend
- Tailwind CSS not working at first, had to reinstall and fix config
- Mobile couldn't connect to backend, was network issue and wrong API URL
- Commit history is messy, sorry for that :)
- If you see any bug, just refresh or check your env vars

---

Thanks for checking my project! If you need more info, ping me.
