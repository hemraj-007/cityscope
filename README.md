# 🌆 Cityscope

Cityscope is a community-driven platform where users can share updates, seek help, and stay connected with their local neighborhood. Built with the **MERN stack** (MongoDB, Express, React, Node.js), deployed on **Render** (backend) and **Vercel** (frontend).

## 🌐 Live URLs

- **Frontend (Vercel)**: [https://cityscope-xi.vercel.app](https://cityscope-xi.vercel.app)
- **Backend (Render)**: [https://cityscope.onrender.com](https://cityscope.onrender.com)

## 🚀 Features

- ✅ User authentication (Signup, Login) with **JWT**
- ✅ Create posts: Share updates, events, recommendations, and more
- ✅ React to posts: **Like** or **Dislike** (only one per user)
- ✅ Reply to posts and view community discussions
- ✅ Filter posts by **location** and **type**
- ✅ User profile page with editable **username** and **bio**
- ✅ Clean, responsive UI with **Tailwind CSS**
- ✅ Deployed on **Render (backend)** and **Vercel (frontend)**
- ✅ Built with **Prisma + PostgreSQL (NeonDB)**

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL (NeonDB)
- **Auth**: JWT
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📦 Setup Instructions (Local)

### 1️⃣ Clone the Repository

git clone https://github.com/hemraj-007/cityscope
cd cityscope

### 2️⃣ Backend Setup (`/backend`)

Go to the backend folder:

cd backend

Install dependencies:

npm install

⚠️ **Note**: `.env` file is already pushed in the repository for demo purposes.

Run Prisma migrations:

npx prisma migrate dev --name init

Start the backend server:

npm run dev

### 3️⃣ Frontend Setup (`/frontend`)

Go to the frontend folder:

cd frontend

Install dependencies:

npm install

⚠️ **Note**: `.env` file is already pushed in the repository for demo purposes.

Start the frontend:

npm run dev

## 📸 Screenshots

*Add screenshots or GIFs here showcasing your app.*

## 💡 Future Enhancements

- ✅ Profile pictures
- ✅ Pagination for feed
- ✅ Notifications system
- ✅ Email verification
- ✅ Full accessibility support

## 👤 Author

**Himraj Bhatia**
