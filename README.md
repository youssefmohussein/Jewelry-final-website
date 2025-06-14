# Jewelry E-Commerce Website

This is a full-stack jewelry e-commerce website built using **Node.js**, **Express.js**, **MongoDB**,and **EJS**. It includes full admin functionality for managing collections, products, and customers, as well as a user-facing frontend for shopping.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, EJS
- **Database**: MongoDB (Mongoose DB)
- **Authentication**: bcrypt, express-session
- **Templating Engine**: EJS

## 📦 Features

### 👤 Users

-Profile Management (name, email, address, password)
-Browse jewelry by collection and category
-View detailed product information
-Place orders (select quantity, confirm shipping info)
-View order history from profile
-Logout
-authentication
-Upon successful order placement, the user's cart is cleared and the order is also recorded under the user's profile for history and future reference.
-can (delete /add) to cart 


### 🛒 Orders
-Users can place orders directly from product pages
-Each order is linked to a user and product(s)
--Order data is stored in MongoDB, including customer details, product names/ID(MongoDB),
 quantity, total price, shipping address, and payment method.
-Admins can view and manage all orders 
-Orders support status tracking (e.g., pending, shipped, delivered, cancelled)
-A unique orderId is generated to ensure traceability and avoid duplication.
-Admins can view, filter, and update order status from a secure dashboard interface.
-After a successful order, the cart session is cleared to prevent duplicate submissions.



### 🔐 Admin
-Login-protected admin dashboard
-Add / Edit / Delete  products 
-Add/Delete Collections
-Upload product images (main and hover)
-Manage:Stock,Price
-View all registered users
-manage users(edit/delete)
-View customer orders




## 📁 Project Structure
