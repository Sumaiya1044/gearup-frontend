# 🏋️ GearUp – Sports & Outdoor Gear Rental Platform

**GearUp** is a modern sports and outdoor gear rental platform that allows customers to discover and rent sports equipment online. Providers can manage their gear and rental orders, while administrators can manage users, gear, rentals, payments, and customer reviews.

The frontend is built with **Next.js, TypeScript, and Tailwind CSS**, with a REST API backend and online payment integration.

---

## 🌐 Live Demo & Project Links

| Resource                         | Link                                           |
| -------------------------------- | ---------------------------------------------- |
| 🚀 **Live Frontend – Vercel**    | https://gearup-frontend-two.vercel.app/        |
| ⚙️ **Live Backend API – Render** | https://gearup-backend-8d3n.onrender.com/      |
| 💻 **Frontend GitHub**           | https://github.com/Sumaiya1044/gearup-frontend |
| 🔧 **Backend GitHub**            | https://github.com/Sumaiya1044/GearUp-Backend  |

---

## ✨ Features

### 👤 Customer

* User registration and login
* Role-based authentication
* JWT authentication
* Browse sports and outdoor gear
* Search and filter gear
* Filter by price
* Check gear availability
* View detailed gear information
* View provider information
* Select rental dates
* Create rental orders
* Online payment using SSLCommerz
* Payment success and cancel pages
* View rental history
* Track rental status
* Submit reviews and ratings after returning gear
* Customer dashboard
* Secure logout

### 🏪 Provider

* Provider authentication
* Provider dashboard
* View total gear
* View active rentals
* View pending orders
* Manage gear inventory
* Add new gear
* Edit gear
* Delete gear
* Set price per day
* Set stock quantity
* Add gear images
* View rental orders
* Confirm rental orders
* Mark orders as picked up
* Mark orders as returned
* Provider logout

### 👑 Admin

* Admin authentication
* Admin dashboard
* View total users
* View active users
* View suspended users
* View total gear
* View rental revenue
* Search users
* Suspend users
* Activate users
* Manage gear availability
* Manage rental orders
* Confirm rental orders
* Mark rentals as picked up
* Mark rentals as returned
* Cancel rental orders
* View customer reviews and ratings
* Content moderation

---

## 🛠️ Technologies Used

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Axios**
* **Zustand**
* **JWT Authentication**
* **Next.js Middleware**

### Backend

* **Node.js**
* **Express.js**
* **TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **JWT**
* **bcrypt**
* **Zod**

### Payment

* **SSLCommerz**

### Deployment

* **Vercel** – Frontend
* **Render** – Backend

---

## 🔐 Authentication & Authorization

GearUp uses **JWT-based authentication** with role-based authorization.

### Available Roles

```text
CUSTOMER
PROVIDER
ADMIN
```

### Login Redirects

```text
CUSTOMER  → /gear
PROVIDER  → /dashboard/provider
ADMIN     → /dashboard/admin
```

Protected dashboard routes are handled using **Next.js Middleware**.

---

## 🛡️ Protected Routes

The following routes require authentication:

```text
/dashboard/customer
/dashboard/provider
/dashboard/admin
```

If an unauthenticated user tries to access a protected route, they are redirected to:

```text
/login
```

---

## 🛒 Rental Flow

```text
Browse Gear
     ↓
View Gear Details
     ↓
Rent Now
     ↓
Select Start & End Date
     ↓
Create Rental Order
     ↓
Payment
     ↓
Order Confirmation
     ↓
Provider Management
     ↓
Picked Up
     ↓
Returned
     ↓
Customer Review
```

---

## 📦 Rental Status

GearUp supports the following rental statuses:

```text
PLACED
CONFIRMED
PICKED_UP
RETURNED
CANCELLED
```

### Normal Rental Status Flow

```text
PLACED
   ↓
CONFIRMED
   ↓
PICKED_UP
   ↓
RETURNED
```

Orders can also be cancelled when applicable.

---

## 💳 Payment Integration

GearUp integrates **SSLCommerz** for online rental payments.

### Payment Flow

```text
Customer
   ↓
Select Gear
   ↓
Select Rental Dates
   ↓
Create Rental
   ↓
Payment Page
   ↓
SSLCommerz
   ↓
Success / Cancel
   ↓
Frontend Result Page
```

### Payment Routes

```text
/payment
/payment/success
/payment/cancel
```

---

## ⭐ Review & Rating System

Customers can submit reviews after their rental has been returned.

### Review Flow

```text
Rental Returned
      ↓
Customer Dashboard
      ↓
Reviews & Ratings
      ↓
Select Gear
      ↓
Select Rating
      ↓
Write Comment
      ↓
Submit Review
```

Administrators can view submitted customer reviews and ratings from the Admin Dashboard.

---

## 📊 Dashboard Overview

### Customer Dashboard

```text
Customer Dashboard
├── Rental Orders
├── Payment History
├── Reviews & Ratings
└── Logout
```

### Provider Dashboard

```text
Provider Dashboard
├── Statistics
├── Rental Orders
├── My Gears
│   ├── Add Gear
│   ├── Edit Gear
│   └── Delete Gear
└── Logout
```

### Admin Dashboard

```text
Admin Dashboard
├── Statistics
├── User Management
├── Gear Management
├── Rental Management
├── Customer Reviews
└── Logout
```

---

## 🔎 Gear Browsing

Customers can:

* Browse available gear
* Search by gear name
* Filter by price
* Check availability
* View gear details
* View provider information
* Start the rental process

The application uses optimized image handling for gear images.

---

## ⚠️ Error & Loading Handling

The frontend provides user-friendly handling for:

* API errors
* Authentication errors
* Authorization errors
* Invalid form submissions
* Payment failures
* Empty data
* Loading states
* Failed API requests

Users receive clear feedback instead of broken or blank pages.

---

## 📱 Responsive Design

GearUp is designed to work across:

* 📱 Mobile
* 📱 Tablet
* 💻 Laptop
* 🖥️ Desktop

Responsive layouts are implemented using **Tailwind CSS**.

---

## 🖼️ Image Handling

Gear images are supported through image URLs.

The project uses **Next.js image optimization** where applicable.

Remote image configuration is handled through:

```text
next.config.ts
```

---

## 📁 Project Structure

```text
gearup-frontend/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   └── provider/
│   │   │
│   │   ├── gear/
│   │   ├── login/
│   │   ├── register/
│   │   ├── payment/
│   │   └── ...
│   │
│   ├── components/
│   └── lib/
│
├── middleware.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/Sumaiya1044/gearup-frontend.git
```

### 2. Enter the project directory

```bash
cd gearup-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create environment file

Create a file named:

```text
.env.local
```

For local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production:

```env
NEXT_PUBLIC_API_URL=https://gearup-backend-8d3n.onrender.com/api
```

### 5. Start the development server

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

## 🔗 API Integration

The frontend communicates with the GearUp backend through REST APIs.

Main API modules:

```text
/api/auth
/api/gear
/api/rentals
/api/payments
/api/reviews
/api/admin
```

The API base URL is configured using:

```env
NEXT_PUBLIC_API_URL
```

---

## 🌍 Deployment

### Frontend – Vercel

The Next.js frontend is deployed on **Vercel**.

🔗 **Live Website:**

https://gearup-frontend-two.vercel.app/

Every push to the `main` branch automatically triggers a new Vercel deployment.

### Backend – Render

The backend API is deployed on **Render**.

🔗 **Live Backend:**

https://gearup-backend-8d3n.onrender.com/

---

## 🧪 Testing Checklist

### Customer

* [x] Registration
* [x] Login
* [x] Browse gear
* [x] Search and filter
* [x] View gear details
* [x] Select rental dates
* [x] Create rental
* [x] Online payment
* [x] View bookings
* [x] Track rental status
* [x] Submit review and rating

### Provider

* [x] Provider login
* [x] Provider dashboard
* [x] Add gear
* [x] Edit gear
* [x] Delete gear
* [x] View rental orders
* [x] Confirm orders
* [x] Mark picked up
* [x] Mark returned

### Admin

* [x] Admin login
* [x] Dashboard statistics
* [x] User management
* [x] Suspend/activate users
* [x] Gear management
* [x] Rental management
* [x] Review management




### GitHub

https://github.com/Sumaiya1044

---

## 📄 License

This project was developed for educational and academic purposes.

## 📚 API Documentation

For complete API endpoint details and frontend-backend integration:

👉 [View API Integration Documentation](./API_INTEGRATION.md)
