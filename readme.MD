# 🔐 Authentication API (JWT + Google OAuth)

A Node.js-based authentication API built with Express that supports:

- ✅ JWT-based login and registration
- 🌐 Google OAuth2 login (via Passport.js)
- 🔐 Forgot/Reset password via email (Gmail SMTP)
- 🛡️ Protected routes using middleware

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Passport.js (Google OAuth)
- JSON Web Token (JWT)
- Nodemailer
- bcrypt
- express-session

---

## 🧩 Project Structure

```
authenticationApi/
│
├── config/            # Passport config and email logic
├── controllers/       # Authentication and password controllers
├── models/            # User model
├── routes/            # Auth-related routes
├── middlewares/       # JWT protection middleware
├── utils/             # AppError, catchAsync, email utilities
├── .env               # Environment variables (not committed)
├── docker-compose.yml # Optional Docker setup
└── server.js          # App entry point
```

---

## ⚙️ Installation

### 📁 1. Clone the Repository

```bash
git clone https://github.com/PanchalKeyur0806/authenticationApi.git
cd authenticationApi
```

### 📦 2. Install Dependencies

```bash
npm install
```

### 🧪 3. Set Up Environment Variables

Create a file named `.env` in the root of your project and copy the following configuration:

```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/Auth

# Server Port
PORT=5000

# JWT Settings
JWT_SECRET=your-app-secret
JWT_EXPIRES=1d

# Session Secret for Passport
SESSSION_SECRET=yoursecret

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CALLBACK_URL=http://localhost:5000/auth/google/callback

# Gmail SMTP for Forgot Password
USER_EMAIL=your-email@gmail.com
GOOGLE_PASSWORD=your-app-password
```

> ⚠️ **Important:**
>
> - Use a Gmail **App Password**, not your real password
> - Never commit your `.env` file to GitHub
> - Use `.env.example` for sharing

---

## ▶️ 4. Start the Server

```bash
npm start
```

Server runs on: [http://localhost:5000](http://localhost:5000)

---

## 🔐 API Endpoints

### 🧾 Auth (JWT)

| Method | Route            | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | `/auth/register` | Register a new user    |
| POST   | `/auth/login`    | Login with email & pwd |
| POST   | `/auth/logout`   | Logout (JWT blacklist) |
| GET    | `/auth/profile`  | Get user profile (JWT) |

### 🌐 Google OAuth

| Method | Route                   | Description              |
| ------ | ----------------------- | ------------------------ |
| GET    | `/auth/google`          | Start Google OAuth login |
| GET    | `/auth/google/callback` | Handle Google response   |

### 🔁 Forgot/Reset Password

| Method | Route                         | Description                   |
| ------ | ----------------------------- | ----------------------------- |
| POST   | `/auth/forgot-password`       | Send reset email              |
| POST   | `/auth/reset-password/:token` | Reset password via token link |

---

## 🐳 Docker Support (Optional)

If you use Docker:

1. Make sure Docker is installed
2. Update `.env` with:

```
MONGO_URL=mongodb://mongo:27017/Auth
```

3. Run with:

```bash
docker-compose up --build
```

---

## 📄 `.env.example`

Share this with your team (create this file in your repo):

```env
MONGO_URL=mongodb://localhost:27017/Auth
PORT=5000

JWT_SECRET=your-app-secret
JWT_EXPIRES=1d

SESSSION_SECRET=yoursecret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CALLBACK_URL=http://localhost:5000/auth/google/callback

USER_EMAIL=your-email@gmail.com
GOOGLE_PASSWORD=your-app-password
```

---

## 🧪 Testing

- Test with Postman or Thunder Client
- Or visit [http://localhost:5000/auth/google](http://localhost:5000/auth/google) to test Google login

---

## 🛡️ Notes

- This API uses **Bearer Tokens** in the `Authorization` header
- Google login uses **Passport sessions**, and a JWT is returned after success
- Password reset uses Gmail SMTP; be sure to enable "App Passwords" in your Google account

---

## 🤝 Contributing

PRs and issues are welcome!

---

## 📜 License

MIT © 2025 [Keyur Panchal](https://github.com/PanchalKeyur0806)
