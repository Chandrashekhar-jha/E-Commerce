# ShopNest E-Commerce Platform 🛒✨

ShopNest is a premium, dark-themed, production-ready MERN (MongoDB, Express, React, Node.js) stack e-commerce application. It features a modern, responsive layout, administrative dashboard management, secure JWT authentication sessions, product image fallback handling, and integrated Razorpay checkout flows.

---

## 🌟 Key Features

### 1. 👥 User Experience & Navigation
* **Stateful Responsive Navbar**: Custom-tailored layout matching guest, standard customer, and administrator views with a mobile hamburger navigation drawer.
* **Featured Landing & Full Catalog**: Homepage displays featured highlights while `/shop` provides an interactive list with instant client-side search and category selectors.
* **Modern Product Details**: Features details layout, related products recommendation grids, dynamic stock badge indicators, and interactive zoom-on-hover effects.

### 2. 🛍️ Cart & Checkout Flow
* **Wide Redesigned Cart**: Features clean item previews, quantity adjustment select fields, and subtotal calculations.
* **Razorpay Payment Integration**: Integrated checkout panel calling secure backend signature validation endpoints before creating customer orders.
* **Order Tracking**: Profile tab lists history of past orders with collapsible details, addresses, and status indicators.

### 3. 🛡️ Advanced Admin Dashboard Control Panel
* **Real-time Overview Analytics**: Metric cards displaying Total Revenue, Total Orders, Total Customers, and Total Products count alongside top-selling items.
* **Product Catalog (CRUD)**: Manage catalog with local name searches, category selectors, stock counts, and edit/add modals featuring Multer/Cloudinary image uploading.
* **Inventory Alerts**: Automatic color-coded stock alerts for out-of-stock and low-stock (<10) items.
* **Order Management**: Update shipping statuses (Pending, Processing, Shipped, Delivered) and perform order deletions.
* **User Control & Roles**: Search registered users, promote standard accounts to administrators, and delete profiles (guarded against self-deletion).

### 4. 🎨 Design & Visual Polish
* **Premium Dark Aesthetic**: Harmony of slate backgrounds with coral accents, custom glassmorphism overlays, and smooth cubic-bezier transitions.
* **Skeleton Shimmer Loading**: Images feature grey loading shimmers while loading asynchronously.
* **Offline SVG Fallback**: Integrated branded SVG vectors that load offline instantly if Unsplash or Cloudinary links fail to prevent broken layout icons.

---

## 🛠️ Technology Stack

* **Frontend**: React (React Router, Redux Toolkit, Context API), Vanilla CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (via Mongoose)
* **Cloud Uploads**: Cloudinary API (via Multer middleware)
* **Payment Gateway**: Razorpay SDK
* **Security**: JWT (JSON Web Tokens), bcryptjs

---

## 🚀 Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) installed locally.
* A running [MongoDB](https://www.mongodb.com/cloud/atlas) database.
* Cloudinary and Razorpay credentials.

### 1. Clone the repository
```bash
git clone https://github.com/Chandrashekhar-jha/E-Commerce.git
cd E-Commerce
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key

EMAIL_USER=your_gmail_for_otp
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Install Dependencies & Seed Database
```bash
# Install root/backend dependencies
npm install

# Run database seeder (seeds 20 products and admin credentials)
npm run seed

# Install frontend dependencies
cd frontend
npm install
```

### 4. Run Locally
```bash
# Start backend server (runs on port 5000)
cd ..
npm run dev

# Start frontend client (runs on port 3000)
cd frontend
npm start
```

---

## 📦 Production Deployment
Build the static frontend bundle and configure node production variables:
```bash
cd frontend
npm run build
```
The Express backend is set up to automatically serve the compiled static build `/frontend/build/index.html` assets when `process.env.NODE_ENV === 'production'`.
