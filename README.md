# Fixmate

## Overview
Fixmate is a web application that [brief description of what the application does]. This README provides instructions for setting up and running the Fixmate project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or later recommended)
- [npm](https://www.npmjs.com/) (v6.x or later) or [Yarn](https://yarnpkg.com/) (v1.22.x or later)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (if using MongoDB as database)
- A text editor or IDE (VS Code, Sublime Text, etc.)

## Environment Setup

1. Clone the repository (Ignore it):
```bash
git clone https://github.com/SufiyanAhmad2025/Fixmate.git
cd fixmate
```

2. Create environment files:
- For backend: Create a `.env` file in the backend directory
- For frontend: Create a `.env` file in the frontend directory

(See the [Environment Variables](#environment-variables) section for details on what to include in these files)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
# or if using Yarn
yarn install
```

3. Set up your environment variables (see [Environment Variables](#environment-variables) section).

4. Start the development server:
```bash
npm run dev
# or if using Yarn
yarn dev
```

The backend server should now be running at `http://localhost:5000` (or the port specified in your environment variables).

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd fixmate-frontend
```

2. Install dependencies:
```bash
npm install
# or if using Yarn
yarn install
```

3. Set up your environment variables (see [Environment Variables](#environment-variables) section).

4. Start the development server:
```bash
npm start
# or if using Yarn
yarn start
```

The frontend application should now be running at `http://localhost:3000`.

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Server configuration
PORT=5000
NODE_ENV=development

# Database configuration
MONGODB_URI=mongodb://localhost:27017/fixmate

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# API keys (if applicable)
API_KEY=your_api_key
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
REACT_APP_NODE_ENV=development
```

## MongoDB Setup

### Installing MongoDB Locally

1. **Download MongoDB Community Edition**:
- Visit the [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Select your operating system and version
- Download the installer and follow the installation instructions

2. **Installation Verification**:
```bash
mongod --version
```

3. **Start MongoDB Service**:
- **On Windows**:
    ```bash
    net start MongoDB
    ```
- **On macOS** (if installed via Homebrew):
    ```bash
    brew services start mongodb-community
    ```
- **On Linux (Ubuntu/Debian)**:
    ```bash
    sudo systemctl start mongod
    ```

### MongoDB Connection String

1. **Default Local Connection String**:
```
mongodb://localhost:27017/fixmate
```
- `mongodb://`: Protocol identifier
- `localhost`: Server address (your local machine)
- `27017`: Default MongoDB port
- `fixmate`: Database name

2. **Connection String with Authentication**:
```
mongodb://username:password@localhost:27017/fixmate
```

3. **Setting Up Authentication**:
```bash
# Connect to MongoDB shell
mongosh

# Switch to admin database
use admin

# Create admin user
db.createUser({
    user: "adminUser",
    pwd: "securePassword",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# Create application user
use fixmate
db.createUser({
    user: "fixmateUser",
    pwd: "appPassword",
    roles: [ { role: "readWrite", db: "fixmate" } ]
})
```

4. **Testing Connection**:
```bash
mongosh "mongodb://localhost:27017/fixmate"
# Or with authentication
mongosh "mongodb://fixmateUser:appPassword@localhost:27017/fixmate"
```

5. **Update your .env file** with the appropriate connection string after setting up authentication.

## Running the Full Application

1. Start the backend server following the backend setup instructions.
2. In a new terminal window, start the frontend server following the frontend setup instructions.
3. Access the application at `http://localhost:3000` in your web browser.

## Troubleshooting

- **Backend connection issues**: Ensure MongoDB is running and the connection string is correct.
- **Port conflicts**: If the specified ports are already in use, modify the PORT variable in your .env files.
- **Package installation failures**: Try clearing npm cache (`npm cache clean --force`) and reinstalling.

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

---

## 📄 License

This project is licensed under the **MIT License**.

© 2026 Fixmate – Group Project  
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, and sublicense.

This project was developed as a **group academic project** and is intended
for learning and demonstration purposes.


