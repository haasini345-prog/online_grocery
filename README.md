# 🛒 Online Grocery Store Web Application

**SDC Project Review-1 Implementation**

A complete, responsive, zero-dependency **Online Grocery Store** web application built exclusively with **HTML5**, **CSS3** (CSS Grid & Flexbox), and **Vanilla JavaScript (ES6+)**. All application state, user accounts, product inventory, shopping cart items, discount coupons, and customer orders are persisted dynamically using Browser **Local Storage**.

---

## 📌 Problem Statement

An online grocery store allows users to browse, search, and purchase groceries from the comfort of their homes. Customers can create shopping carts, apply discount coupons, and schedule delivery dates and time slots. The system includes inventory management for store admins, enabling them to update product availability, adjust pricing, and modify stock levels. Features like live order tracking and personalized recommendations enhance the overall shopping experience.

---

## 🎯 Objectives

1. Create a complete business system featuring two distinct modules:
   - **User Module** (Customer Portal)
   - **Admin Module** (Store Management Panel)
2. Enforce strict technology constraints: No backend servers, framework libraries, or external database engines.
3. Utilize pure CSS Grid and Flexbox for mobile-responsive, modern UI layouts.
4. Implement Role-Based Access Control (RBAC) and module navigation using JavaScript and Browser Local Storage.
5. Provide a clean, GitHub-ready project structure that is easy for a student to demonstrate and explain during an SDC review.

---

## 🔑 Demo Access Credentials

| Module | Email Address | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin Panel** | `admin@grocery.com` | `admin123` | Store Administrator |
| **Customer Portal** | `john@example.com` | `user123` | Customer |
| **New Customer** | Register via [signup.html](signup.html) | Any Custom Password | Customer (Default) |

> 🏷️ **Demo Coupons**:
> - `SAVE10` : 10% Discount on orders over ₹100
> - `GROCERY20` : 20% Discount on orders over ₹300

---

## ✨ Key Features & Modules

### 1. 🛍️ User Module (`user-dashboard.html`)
- **Product Catalog Browsing**: View grocery products in cards with prices, discount tags, images, and live stock status.
- **Instant Search**: Search products in real-time by product name or category.
- **Category Filter Chips**: Filter items by *Fruits*, *Vegetables*, *Dairy*, *Bakery*, *Beverages*, *Snacks*, and *Household*.
- **Interactive Shopping Cart**:
  - Add items and modify quantities (`+` / `-`).
  - Item removal with automatic subtotal computation.
  - Coupon Code Engine (`SAVE10`, `GROCERY20`) with instant discount validation.
- **Checkout & Order Creation**:
  - Enter delivery address, pick preferred date and time slot (Morning / Afternoon / Evening).
  - Select payment method (Cash on Delivery / Online Payment demo).
  - Deducts purchased quantity automatically from product stock in Local Storage.
- **Order History & Real-Time Step Tracker**:
  - View previous orders with Order ID, items breakdown, total price, and delivery dates.
  - Visual step progress bar tracker: `Placed` ➔ `Confirmed` ➔ `Packed` ➔ `Out for Delivery` ➔ `Delivered`.
- **Personalized Recommendations Engine**:
  - Calculates interaction weights based on user category views and previous purchases to suggest relevant grocery items.
- **Profile Management**: Displays user details and active session management.

### 2. ⚙️ Admin Module (`admin-dashboard.html`)
- **KPI Analytics Dashboard**:
  - Total Products count
  - Total Orders count
  - Total Registered Users count
  - Total Revenue generated (sum of non-cancelled orders)
  - Low Stock Items Alert counter (`stock <= 5`)
- **Product CRUD Management**:
  - Add new products with category, price, discount %, stock quantity, image URL, and description.
  - Edit existing product details via modal dialogs.
  - Delete products with immediate Local Storage synchronization.
- **Fast Inventory Control**:
  - Inline stock quantity and price updates.
  - Availability toggle (`Available` / `Unavailable`).
  - Low-stock warning highlights.
- **Order Status Manager**:
  - View all customer orders.
  - Update order status dropdown (`Order Placed`, `Confirmed`, `Packed`, `Out for Delivery`, `Delivered`, `Cancelled`).
  - Immediately updates customer tracking progress bars.
- **User Account Management**: Overview of registered users, roles, and registration dates.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic web page structure and form inputs.
- **CSS3**: CSS Variables for design consistency, CSS Grid layout, Flexbox, custom step progress bars, responsive media queries, modal overlays, toast notifications.
- **Vanilla JavaScript (ES6+)**:
  - Modular script separation (`app.js`, `auth.js`, `products.js`, `cart.js`, `orders.js`, `admin.js`).
  - DOM Manipulation & Event Handlers.
  - Array helper methods (`map`, `filter`, `reduce`, `find`, `sort`).
- **Browser Local Storage**: Client-side data persistence for users, session, products, cart, orders, coupons, and recommendation tracking.

---

## 📁 File Structure

```
online-grocery-store/
│
├── index.html            # Landing page (Hero section, categories, benefits, featured items)
├── login.html            # User & Admin authentication form with credentials guide
├── signup.html           # Customer registration form with email duplication prevention
├── user-dashboard.html   # Customer interface (Catalog, search, cart, checkout, orders, recommendations)
├── admin-dashboard.html  # Admin panel (KPI cards, Product CRUD, Inventory, Orders update, Users list)
│
├── css/
│   └── style.css         # Modern design system, CSS variables, CSS Grid/Flexbox layouts & media queries
│
├── js/
│   ├── app.js            # Core data initialization, sample datasets, Local Storage methods & toast system
│   ├── auth.js           # Authentication logic, registration, credential validation, RBAC guards
│   ├── products.js       # Product rendering, live search, category filtering, recommendation algorithm
│   ├── cart.js           # Shopping cart management, quantity modifiers, coupon validator, order submission
│   ├── orders.js         # User order history rendering & step progress tracker
│   └── admin.js          # Admin dashboard analytics, product modal CRUD, inventory table, order status updater
│
└── README.md             # SDC Project Review documentation
```

---

## 🚀 How to Run the Project

1. **Clone or Download** the project files to your local system.
2. Open the project folder (`online_grocery`).
3. Double-click **`index.html`** or right-click `index.html` ➔ **Open with Browser** (Chrome, Firefox, Edge, Safari).
4. *No installation, node server, or database configuration required!*

---

## 🎓 SDC Project Review Explanation Guide

During your SDC Project Review-1, you can explain the project components using the following points:

1. **Data Seeding**: When `index.html` or `app.js` runs for the first time, `initLocalStorage()` checks if keys like `grocery_products` exist. If missing, it populates initial datasets (15 sample products, demo admin account `admin@grocery.com`, coupons, sample order).
2. **Authentication & RBAC**: `auth.js` manages login credential matching. Upon login, `currentUser` is stored in `localStorage`. Page guards (`requireAuth()` and `requireAdmin()`) run at the top of dashboard scripts to prevent unauthorized access.
3. **Cart & Inventory Interaction**: When an order is placed in `cart.js`, the app iterates over cart items, subtracts ordered quantities from product stock, updates `grocery_products` in Local Storage, and inserts a new order object into `grocery_orders`.
4. **Order Tracking**: In `orders.js`, status values (e.g. `Packed`, `Out for Delivery`) are matched against an array of stages (`ORDER_STAGES`) to calculate step node indexes and render completed/active CSS classes on the step progress bar.
5. **Recommendation Logic**: `products.js` tracks category views and purchases. Items matching the user's top-weighted categories are selected and displayed in the "Recommended For You" tab.

---

## 🚀 Future Enhancements

- Integration of a real payment gateway API (Razorpay / Stripe).
- Geolocation-based address detection and delivery distance calculator.
- Wishlist and recurring subscription orders (e.g. daily milk delivery).
- PDF invoice download for placed orders.

---

*Developed for SDC Project Review-1.*
