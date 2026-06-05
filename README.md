# School Management API

A production-ready, highly organized RESTful API built with **Node.js**, **Express.js**, and **MySQL**. It permits adding schools and retrieving them sorted by geodesic proximity to a specified user location (using the Haversine formula).

---

## Features

- **Clean Architecture**: Decoupled routes, controllers, validation rules, utility functions, database pools, and error middleware.
- **Input Validation**: Strict rules utilizing `express-validator` to guarantee data integrity.
- **Error Handling**: Centralized error middleware returning consistent JSON responses and proper HTTP status codes.
- **Security**: Strict environment variable isolation, CORS configured, and SQL injection prevention via prepared statements.
- **Proximity Sorting**: Dynamic location sorting based on the earth-radius Haversine calculation.
- **Database Init Tool**: Ready-to-go npm script to create database and tables instantly.
- **Postman Collection Included**: Complete JSON collection ready for import.

---

## Database Design

### Schema for `schools` Table
```sql
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);
```

---

## Folder Structure

```text
school-management-api/
│
├── src/
│   ├── config/
│   │   ├── db.js          # MySQL connection pool
│   │   └── initDb.js      # Database/table initialization script
│   │
│   ├── controllers/
│   │   └── schoolController.js # addSchool & listSchools controller logic
│   │
│   ├── routes/
│   │   └── schoolRoutes.js     # Express routes mapped to controllers
│   │
│   ├── middleware/
│   │   ├── validation.js       # Input validation (express-validator)
│   │   └── errorHandler.js     # Centralized error handler
│   │
│   ├── utils/
│   │   └── distanceCalculator.js # Haversine formula implementation
│   │
│   └── app.js             # Express app setup and global middlewares
│
├── scratch/
│   └── test_api.js        # Self-contained local integration test script
│
├── .env                   # Configuration for environment variables
├── package.json           # Node project manifest
├── school-management-api.postman_collection.json # Postman collection
├── server.js              # Entrypoint to spin up server listener
└── README.md              # Documentation (this file)
```

---

## Prerequisites & Installation

### 1. Requirements
Ensure you have the following installed on your system:
- **Node.js** (v18+ recommended)
- **npm** (v9+)
- **MySQL Server** (local service via XAMPP/WAMP or a cloud-hosted MySQL database)

### 2. Install Dependencies
Clone/download the repository, open a terminal in the project directory, and run:
```bash
npm install
```

---

## Configuration & Environment Variables

Create a file named `.env` in the root of the project directory (an example is already created for you in the workspace):
```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=school_db
NODE_ENV=development
```

- **PORT**: Port on which the express server will listen (defaults to `3000`).
- **DB_HOST**: Address of your MySQL server.
- **DB_PORT**: MySQL server port (defaults to `3306`).
- **DB_USER**: MySQL username.
- **DB_PASSWORD**: MySQL password (leave empty if there's none).
- **DB_NAME**: Database name to use or create.
- **NODE_ENV**: Set to `production` in live environments to suppress stack traces.

---

## Database Setup

Make sure your MySQL server is running.

### Local Initialization (via npm)
You can automatically create the database and table using the provided script. Run:
```bash
npm run init-db
```
This runs the `src/config/initDb.js` script, connecting to your MySQL server, executing `CREATE DATABASE IF NOT EXISTS school_db;` and constructing the `schools` table.

---

## Running the Application

### Development Mode (with hot-reloading)
```bash
npm run dev
```
The server will start on port `3000`. Changes to the files will automatically restart the server using `nodemon`.

### Production Mode
```bash
npm start
```

---

## API Endpoints

### 1. Health Status
Check if the API is active and running.
* **URL**: `/`
* **Method**: `GET`
* **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Welcome to the School Management API",
    "status": "Healthy"
  }
  ```

---

### 2. Add School
Add a new school's details to the database.
* **URL**: `/addSchool`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "name": "ABC School",
    "address": "Chennai, Tamil Nadu",
    "latitude": 13.0827,
    "longitude": 80.2707
  }
  ```
* **Validation Rules**:
  - `name`: Must not be empty. Max length 255.
  - `address`: Must not be empty. Max length 500.
  - `latitude`: Must be a valid float between `-90` and `90`.
  - `longitude`: Must be a valid float between `-180` and `180`.
* **Response (Success - 201 Created)**:
  ```json
  {
    "success": true,
    "message": "School added successfully"
  }
  ```
* **Response (Validation Error - 400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      {
        "field": "latitude",
        "message": "Latitude must be a valid number between -90 and 90"
      }
    ]
  }
  ```

---

### 3. List Schools
Get all schools sorted by their proximity to a specified location.
* **URL**: `/listSchools`
* **Method**: `GET`
* **Query Parameters**:
  - `latitude` (Required): Valid float between `-90` and `90`.
  - `longitude` (Required): Valid float between `-180` and `180`.
* **Example**:
  ```http
  GET /listSchools?latitude=13.0827&longitude=80.2707
  ```
* **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "count": 3,
    "schools": [
      {
        "id": 1,
        "name": "ABC School",
        "address": "Chennai, Tamil Nadu",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "distance": 0
      },
      {
        "id": 2,
        "name": "XYZ School",
        "address": "Mumbai, Maharashtra",
        "latitude": 19.076,
        "longitude": 72.8777,
        "distance": 1033.1
      }
    ]
  }
  ```

---

## Local Integration Verification

You can verify the endpoints locally by starting the server and executing the pre-written test runner script:
```bash
node scratch/test_api.js
```
This script runs various test cases, hitting `localhost:3000` to verify status codes and validation payloads.

---

## Postman Collection Instructions

We have exported and saved a Postman collection in the root folder: **[school-management-api.postman_collection.json](./school-management-api.postman_collection.json)**.

### How to use:
1. Open Postman.
2. Click **Import** in the top left.
3. Drag and drop the `school-management-api.postman_collection.json` file.
4. Set up the collection variable `base_url` to point to either:
   - Localhost: `http://localhost:3000`
   - Your Deployed URL: e.g., `https://school-management-api.onrender.com`
5. You can test adding/retrieving schools, along with validation failure test cases.

### Creating a Shareable Postman Link:
1. In Postman, hover over the imported collection and click the `...` (more options) button.
2. Click **Share**.
3. Choose the **Via API** or **Get Link** option.
4. Click **Generate Link** to create a public, shareable link to submit with your deliverables.

---

## Deployment to Render & Cloud Database Setup

Because Render's free tier only hosts PostgreSQL, you need to spin up a free MySQL instance on an external provider (like **Aiven** or **Clever Cloud**) to deploy the complete system live:

### Step 1: Provision a Free Cloud MySQL Database
1. Sign up for a free account at [Aiven.io](https://aiven.io/) or [Clever Cloud](https://www.clever-cloud.com/) (no credit card required).
2. Create a new **MySQL** database instance.
3. Once running, copy the connection details:
   - **Host** (e.g., `mysql-3c58b-xyz.aivencloud.com`)
   - **Port** (e.g., `12345` or `3306`)
   - **Database Name** (e.g., `defaultdb` or `school_db`)
   - **User** (e.g., `avnadmin` or `root`)
   - **Password**

### Step 2: Initialize the Remote Database
Locally, modify your `.env` temporarily to use these cloud database credentials, and run the initialization script to setup the schema on the remote server:
```bash
npm run init-db
```
*(Make sure to revert your `.env` back to localhost credentials for local testing!)*

### Step 3: Deploy to Render
1. Push your project files to a public GitHub repository.
2. Log in to [Render](https://render.com/).
3. Click **New** -> **Web Service**.
4. Connect your GitHub repository.
5. Provide a service name, select **Node** runtime, and configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Scroll down to **Environment Variables** and add:
   - `DB_HOST`: *[Your Cloud Host]*
   - `DB_PORT`: *[Your Cloud Port]*
   - `DB_USER`: *[Your Cloud Username]*
   - `DB_PASSWORD`: *[Your Cloud Password]*
   - `DB_NAME`: *[Your Cloud Database Name]*
   - `NODE_ENV`: `production`
7. Click **Deploy Web Service**. Render will build and host your API live!
