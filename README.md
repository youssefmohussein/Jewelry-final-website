# Velora Jewelry Store

A full-featured e-commerce platform for a jewelry store built with Node.js, Express, and MongoDB.

## 🌟 Features

- **User Authentication**
  - Secure user registration and login
  - Password reset functionality
  - Session management
  - Role-based access control

- **Product Management**
  - Browse products by categories
  - Detailed product views
  - Product search functionality
  - Product filtering and sorting

- **Shopping Experience**
  - Shopping cart functionality
  - Order management
  - User profile management
  - Order history tracking

- **Internationalization**
  - Multi-language support (English and Arabic)
  - Dynamic language switching
  - Localized content

- **Admin Dashboard**
  - Product management
  - Order management
  - User management
  - Category management

## 🛠️ Technologies Used

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Express Session for authentication
  - bcryptjs for password hashing

- **Frontend**
  - EJS templating engine
  - CSS for styling
  - JavaScript for interactivity

- **Additional Features**
  - i18n for internationalization
  - Multer for file uploads
  - Nodemailer for email functionality
  - Cookie-parser for cookie management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/youssefmohussein/Jewelry-final-website.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   SECRET_KEY=your_session_secret
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
├── controllers/     # Route controllers
├── models/         # Database models
├── routes/         # Route definitions
├── views/          # EJS templates
├── public/         # Static files
├── middleware/     # Custom middleware
├── utils/          # Utility functions
├── locales/        # Translation files
└── index.js        # Application entry point
```

## 🔒 Security Features

- Secure password hashing with bcrypt
- Session-based authentication
- HTTP-only cookies
- CSRF protection
- Secure session storage with MongoDB

## 🌐 Internationalization

The application supports multiple languages:
- English (default)
- Arabic

Language can be switched using the query parameter `?lang=en` or `?lang=ar`

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For any queries or support, please open an issue in the GitHub repository.
