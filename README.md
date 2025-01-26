# Backend API Documentation

This documentation provides an overview of the API endpoints used in the backend of the user management system. The backend handles user registration, login, and authentication.

---

## API Endpoints

### 1. **POST /api/auth/register**

This endpoint is used for registering a new user. The user needs to provide an email, password, and role to create a new account.

#### Request:

- **Method:** POST
- **URL:** /api/auth/register
- **Body:**  
  {  
   "email": "user@example.com",  
   "password": "securePassword123",  
   "role": "user"  
  }
  - `role` can be either `'user'` or `'admin'`. Default is `'user'`.

#### Response:

- **Success:**  
  {  
   "message": "User registered successfully"  
  }
- **Error:**
  - If the email is already registered or invalid input:  
    {  
     "error": "Email already exists"  
    }

#### Description:

This API receives a POST request containing the user's email, password, and role. It hashes the password and saves the user information in the database. Upon successful registration, a success message is returned.

---

### 2. **POST /api/auth/login**

This endpoint is used for user login. The user provides their email and password, and if the credentials match, a JWT token is returned for authentication.

#### Request:

- **Method:** POST
- **URL:** /api/auth/login
- **Body:**  
  {  
   "email": "user@example.com",  
   "password": "securePassword123"  
  }

#### Response:

- **Success:**  
  {  
   "token": "JWT_TOKEN_HERE",  
   "role": "user"  
  }
  - `role` will be either `'user'` or `'admin'` depending on the user's role.
- **Error:**
  - If credentials are invalid:  
    {  
     "error": "Invalid credentials"  
    }

#### Description:

This API validates the user's login credentials. It compares the provided password with the stored hashed password in the database using bcrypt. If the credentials are valid, a JWT token is generated and sent back to the user, allowing them to authenticate further requests. The token is set to expire in 1 hour. If the credentials are invalid, a 400 error is returned.

---

## Server Configuration

- **Express** is used as the server framework.
- **MongoDB** is used to store user information, with **Mongoose** handling database interaction.
- **JWT (JSON Web Token)** is used to generate authentication tokens for logged-in users.
- **Bcrypt** is used to securely hash and compare passwords.
- **CORS** is configured to allow access from the frontend.

---

## Environment Variables

The following environment variables are required for the backend:

- `DB_URI`: The MongoDB connection URI.
- `JWT_SECRET`: The secret key used to sign JWT tokens.

These variables should be configured in the `.env` file.

---

## Conclusion

This backend API provides two primary functionalities: user registration and login. Users can create accounts and log in using their credentials. Upon successful login, they receive a JWT token for authenticated requests. The system ensures password security using bcrypt and JWT for session management.
