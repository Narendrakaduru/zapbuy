# 🛒 ZapBuy

ZapBuy is a modern full-stack e-commerce platform built with **Node.js (Express)** for the backend, **Angular** for the frontend, and **MongoDB** for the database.  
It includes user authentication, product management, cart, orders, and centralized logging — all running inside Docker containers for easy deployment.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Running the App](#-running-the-app)
- [Folder Structure](#-folder-structure)
- [Environment Configuration](#-environment-configuration)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **User Management** — Sign up, login, role-based access (USER, ADMIN, SUPER_ADMIN)
- **Product Management** — CRUD operations, likes, and comments
- **Cart & Orders** — Add to cart, place orders, track status
- **Centralized Logging** — Winston-based with severity levels and module tagging
- **Secure Auth** — JWT authentication and password hashing with bcrypt
- **Email Verification** — OTP-based email verification before registration
- **Responsive Frontend** — Angular 16 with filters, sorting, and themed UI
- **Dockerized Setup** — One command to spin up backend + frontend

---

## 🛠 Tech Stack

| Layer       | Technology |
|-------------|------------|
| **Frontend**| Angular 16 |
| **Backend** | Node.js (Express) |
| **Database**| MongoDB |
| **Auth**    | JWT + bcrypt |
| **Email**   | Nodemailer |
| **Logging** | Winston |
| **Deployment** | Docker + docker-compose |

---

## 🏗 Architecture

ZapBuy follows a **modular microservices-style structure**:

- **Backend Services**
  - Auth Service
  - User Service
  - Product Service
  - Cart Service
  - Order Service
  - Logging Service
- **Frontend**
  - Angular SPA consuming backend APIs
- **Database**
  - MongoDB collections per module

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Narendrakaduru/zapbuy.git
cd zapbuy
```

### 2. Create .env files

Create an **.env** in the **zapbuy-backend/** folder:

```bash
MONGODB_URI=mongodb://localhost:27017/zapbuy
PORT=8000
BASE_URL=http://localhost:8000
JWT_SECRET=*************
EMAIL_USER=*************
EMAIL_PASS=*************
CLIENT_URL=http://localhost:4200
NODE_ENV=production
```

## 🖥 Running the App

### Option 1 — Using Docker (recommended)

```bash
docker-compose up --build
```
- **Backend: http://localhost:8000**
- **Frontend: http://localhost:4200**

### Option 2 — Manual Run

Backend

```bash
cd zapbuy-backend
npm install
npm start
```

Frontend

```bash
cd zapbuy-frontend
npm install
ng serve
```

## 📂 Folder Structure

```bash
zapbuy/
├── docker-compose.yml
├── zapbuy-backend/
│   ├── src/
│   │   ├── modules/        # User, Product, Cart, Order modules
│   │   ├── config/         # App configs
│   │   ├── middlewares/    # Auth, logging, error handling
│   │   └── utils/
│   └── package.json
└── zapbuy-frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   ├── services/
    │   │   └── pages/
    │   └── assets/
    └── package.json
```