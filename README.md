# E-Commerce Backend

This is the backend for an e-commerce platform built using Node.js, Express, and MongoDB. The backend includes user authentication, product management, order processing, coupon management, and integration with external services like Cloudinary for image storage.

## Features

- **User Management**: Register, login, password reset, and account management.
- **Product Management**: Create, read, update, delete, and rate products.
- **Cart Management**: Add products to the user's shopping cart.
- **Order Processing**: Manage orders, payments, and shipping.
- **Coupon Management**: Create, update, and delete discount coupons.
- **Wishlist**: Add products to a user's wishlist.
- **Admin Role**: Admin users can manage products, users, and view order details.

## Technologies Used

- **Node.js**: JavaScript runtime for building the API.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing data (using Mongoose for ORM).
- **JWT (JSON Web Token)**: Authentication for secure access.
- **Bcrypt**: Hashing passwords for security.
- **Cloudinary**: Cloud storage for managing product images.
- **Multer**: Middleware for handling file uploads (e.g., product images).
- **Nodemailer**: Used for sending emails (e.g., password resets, order confirmations).
- **Morgan**: HTTP request logging middleware for logging API requests.
- **Sharp**: Image processing library for resizing and optimizing images before storing them in Cloudinary.
- **Slugify**: Used to generate URL-friendly slugs from product titles and other strings.
- **Body-Parser**: Middleware to parse incoming request bodies in JSON format.
- **Cookie-Parser**: Middleware for parsing cookies sent by clients.
- **Express-Async-Handler**: A utility for handling asynchronous routes in Express.
- **Dotenv**: Loads environment variables from a `.env` file.
- **Nodemon**: Utility for automatically restarting the server during development when files change.

## Installation

1. Clone the repository:
    git clone https://github.com/kageruka02/e-commerce-backend.git
    cd e-commerce-backend
2. Install dependencies:
    npm install
3. Create a .env file in the root of the project and add your environment variables:
    PORT
    MONGO_URL
    JWT_SECRET 
    MAIL_ID
    MP
    CLOUD_NAME 
    API_KEY  
    API_SECRET 
4. start the server
    npm run server


**END POINTS**
    **user Routes**
    ## User Routes

| Method   | Endpoint                           | Description                     | Access Control  |
|----------|-----------------------------------|---------------------------------|-----------------|
| POST     | `/api/user/register`              | Register a new user             | Public          |
| POST     | `/api/user/login`                 | Login a user                    | Public          |
| POST     | `/api/user/forgort-password-token`| Generate a forgot password token| Public          |
| POST     | `/api/user/admin-login`           | Login as an admin               | Public          |
| POST     | `/api/user/cart`                  | Add items to the cart           | Authenticated   |
| PUT      | `/api/user/reset-password/:token` | Reset user password             | Public          |
| GET      | `/api/user/allUsers`              | Get all users                   | Admin only      |
| GET      | `/api/user/refresh`               | Refresh user token              | Authenticated   |
| GET      | `/api/user/logout`                | Logout user                     | Authenticated   |
| GET      | `/api/user/wishlist`              | Get user wishlist               | Authenticated   |
| GET      | `/api/user/:id`                   | Get a single user by ID         | Admin only      |
| DELETE   | `/api/user/:id`                   | Delete a user by ID             | Admin only      |
| PATCH    | `/api/user/edit-user`             | Update user profile             | Authenticated   |
| PUT      | `/api/user/password`              | Update user password            | Authenticated   |
| PUT      | `/api/user/address`               | Save user address               | Authenticated   |
| PUT      | `/api/user/block-user/:id`        | Block a user                    | Admin only      |
| PUT      | `/api/user/unblock-user/:id`      | Unblock a user                  | Admin only      |

    **Product Routes**

| Method   | Endpoint                     | Description                     | Access Control  |
|----------|------------------------------|---------------------------------|-----------------|
| POST     | `/api/product`               | Create a new product            | Admin only      |
| GET      | `/api/product`               | Get all products                | Public          |
| GET      | `/api/product/:id`           | Get a single product by ID      | Public          |
| PATCH    | `/api/product/:id`           | Update a product                | Admin only      |
| PUT      | `/api/product/addToWishlist` | Add product to wishlist         | Authenticated   |
| PUT      | `/api/product/rating`        | Rate a product                  | Authenticated   |
| PUT      | `/api/product/upload/:id`    | Upload product images           | Admin only      |
| DELETE   | `/api/product/:id`           | Delete a product                | Admin only      |

    ### Product Category Routes

| Method   | Endpoint                | Description                      | Access Control  |
|----------|-------------------------|----------------------------------|-----------------|
| POST     | `/api/Pcategory`        | Create a new product category    | Admin only      |
| PUT      | `/api/Pcategory/:id`    | Update a product category        | Admin only      |
| DELETE   | `/api/Pcategory/:id`    | Delete a product category        | Admin only      |
| GET      | `/api/Pcategory`        | Get all product categories       | Public          |
| GET      | `/api/Pcategory/:id`    | Get a single product category    | Public          |

    ### Coupon Routes

| Method   | Endpoint         | Description             | Access Control  |
|----------|------------------|-------------------------|-----------------|
| POST     | `/api/coupon`    | Create a new coupon     | Admin only      |
| GET      | `/api/coupon`    | Get all coupons         | Admin only      |
| PUT      | `/api/coupon/:id`| Update a coupon         | Admin only      |
| DELETE   | `/api/coupon/:id`| Delete a coupon         | Admin only      |


    ### Brand Routes

| Method   | Endpoint          | Description                | Access Control  |
|----------|-------------------|----------------------------|-----------------|
| POST     | `/api/brand`      | Create a new brand         | Admin only      |
| PUT      | `/api/brand/:id`  | Update a brand             | Admin only      |
| DELETE   | `/api/brand/:id`  | Delete a brand             | Admin only      |
| GET      | `/api/brand`      | Get all brands             | Public          |
| GET      | `/api/brand/:id`  | Get a single brand by ID   | Public          |

    ### Blog Routes

| Method   | Endpoint              | Description                      | Access Control  |
|----------|-----------------------|----------------------------------|-----------------|
| POST     | `/api/blog`           | Create a new blog                | Admin only      |
| PUT      | `/api/blog/likes`     | Like a blog post                 | Authenticated   |
| PUT      | `/api/blog/dislikes`  | Dislike a blog post              | Authenticated   |
| PUT      | `/api/blog/:id`       | Update a blog post               | Admin only      |
| GET      | `/api/blog`           | Get all blog posts               | Public          |
| GET      | `/api/blog/:id`       | Get a single blog post by ID     | Public          |
| DELETE   | `/api/blog/:id`       | Delete a blog post               | Admin only      |

    ### Blog Category Routes

| Method   | Endpoint               | Description                        | Access Control  |
|----------|------------------------|------------------------------------|-----------------|
| POST     | `/api/Bcategory`       | Create a new blog category         | Admin only      |
| PUT      | `/api/Bcategory/:id`   | Update a blog category by ID       | Admin only      |
| DELETE   | `/api/Bcategory/:id`   | Delete a blog category by ID       | Admin only      |
| GET      | `/api/Bcategory`       | Get all blog categories            | Public          |
| GET      | `/api/Bcategory/:id`   | Get a single blog category by ID   | Public          |

# 🚧 Work in Progress

This project is still under active development. Some features and endpoints may be incomplete or subject to change. Stay tuned for updates!
