# 📋 Employee Shift Board

> **Full-Stack HR Utility Application** - A production-ready shift management system with JWT authentication, role-based access control, and custom business rules.

---

## 🎯 Project Overview

Employee Shift Board is a **full-stack web application** designed to manage employee shifts efficiently with real-world business rules. It validates shift creation, prevents overlaps, enforces minimum duration, and implements role-based access control for different user types.

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose             |
| ---------- | ------- | ------------------- |
| Node.js    | 18+     | Runtime environment |
| Express.js | 5.x     | Web framework       |
| MongoDB    | Latest  | NoSQL database      |
| Mongoose   | 9.x     | ODM for MongoDB     |

### Frontend

| Technology   | Version | Purpose             |
| ------------ | ------- | ------------------- |
| React        | 18.x    | JS framework        |
| React Router | 6.x     | Client-side routing |
| Tailwind CSS | 3.x     | CSS framework       |

### Database

- **MongoDB Atlas** (Cloud) - MongoDB hosting

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **MongoDB Atlas Account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### Step 1: Clone Repository

```bash
git clone https://github.com/arafatmansuri/shift-board.git
cd shift-board
```

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.9alzg2r.mongodb.net/shiftboard
PORT=3000
JWT_ACCESS_TOKEN_SECRET=randomAccessTokenSecret
JWT_REFRESH_TOKEN_SECRET=randomRefreshTokenSecret
EOF

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:3000**

### Step 3: Setup Frontend

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

Frontend will run on: **http://localhost:1573**

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "hire-me@anshumat.org",
  "password": "HireMe@2025!"
}
```

**Response:**

```json
{
  "message": "login successfull",
  "success": true,
  "user": {
    "_id": "692d6dab227e946f7e0eb3a9",
    "username": "hire-me@anshumat.org",
    "email": "hire-me@anshumat.org",
    "role": "admin",
    "createdAt": "2025-12-02T05:41:14.767Z",
    "updatedAt": "2025-12-02T06:49:14.637Z"
  }
}
```

### Employee Endpoints

#### Get All Employees (Admin Only)

```http
GET /employee/view
Authorization: cookies
```

**Response:**

```json
{
  "message": "Employee details fetched sucessfully",
  "success": true,
  "employees": [
    {
      "_id": "692e7bfa321861a5e029442f",
      "username": "employee1",
      "email": "employee1@gmail.com",
      "role": "employee",
      "employeeCode": "EMP001",
      "department": {
        "_id": "692e7ad0321861a5e0294428",
        "departmentName": "IT",
        "departmentCode": "DEP001",
        "departmentManager": "692e7bfa321861a5e029442f"
      },
      "createdAt": "2025-12-02T05:41:14.767Z",
      "updatedAt": "2025-12-03T17:46:54.911Z"
    }
  ]
}
```

#### Create Employee (Admin Only)

```http
POST /employee/create
Authorization: cookies
Content-Type: application/json

{
    "username":"employee10",
    "email":"employee10@gmail.com",
    "password":"Employee10@123",
    "department":"692e7ad0321861a5e0294428",
    "employeeCode":"EMP0010"
}
```

**Response:**

```json
{
  "message": "Employee created sucessfully",
  "success": true,
  "employee": {
    "username": "employee10",
    "email": "employee10@gmail.com",
    "role": "employee",
    "employeeCode": "EMP0010",
    "department": "692e7ad0321861a5e0294428",
    "_id": "69315f3de0c4d3e12f09d511",
    "createdAt": "2025-12-04T10:15:25.608Z",
    "updatedAt": "2025-12-04T10:15:25.608Z"
  }
}
```

#### Delete Employee (Admin Only)

```http
DELETE /employee/delete/:id
Authorization: cookies
Content-Type: application/json

{
    "message": "Employee deleted sucessfully",
    "success": true,
}
```

### Shift Endpoints

#### Create Shift (Admin Only)

```http
POST /shift/shifts
Authorization: cookies
Content-Type: application/json

{
  "employeeId": "507f1f77bcf86cd799439011",
  "date": "2025-12-15",
  "startTime": "09:00",
  "endTime": "17:00"
}
```

**Response:**

```json
{
  "message": "Shift created successfully",
  "success": true,
  "shift": {
    "date": "2025-12-05T00:00:00.000Z",
    "startTime": "09:30",
    "endTime": "13:30",
    "employeeId": "692e7bfa321861a5e029442f",
    "_id": "69316033e0c4d3e12f09d519",
    "__v": 0
  }
}
```

#### Get Shifts

```http
GET shift/shifts?employeeId={employeeId}&date={date}
Authorization: cookies
```

**Response:**

```json
{
  "message": "shifts fetched successfully",
  "success": true,
  "shifts": [
    {
      "_id": "692f185d4a1063c9f5a32c5e",
      "date": "2025-12-05T00:00:00.000Z",
      "startTime": "18:15",
      "endTime": "22:18",
      "employeeId": {
        "_id": "692e7bfa321861a5e029442f",
        "username": "employee1",
        "email": "employee1@gmail.com",
        "role": "employee",
        "employeeCode": "EMP001",
        "department": "692e7ad0321861a5e0294428",
        "createdAt": "2025-12-02T05:41:14.767Z",
        "updatedAt": "2025-12-03T17:46:54.911Z",
        "__v": 0
      },
      "__v": 0
    },
    {
      "_id": "69316033e0c4d3e12f09d519",
      "date": "2025-12-05T00:00:00.000Z",
      "startTime": "09:30",
      "endTime": "13:30",
      "employeeId": {
        "_id": "692e7bfa321861a5e029442f",
        "username": "employee1",
        "email": "employee1@gmail.com",
        "role": "employee",
        "employeeCode": "EMP001",
        "department": "692e7ad0321861a5e0294428",
        "createdAt": "2025-12-02T05:41:14.767Z",
        "updatedAt": "2025-12-03T17:46:54.911Z",
        "__v": 0
      },
      "__v": 0
    }
  ]
}
```

#### Delete Shift (Admin Only)

```http
DELETE shift/delete/:id
Authorization: cookies
```

**Response:**

```json
{
  "success": true,
  "message": "Shift deleted successfully"
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Shift must be greater than 4 hours"
}
```

```json
{
  "success": false,
  "message": "Employee has overlapping shift on this date"
}
```

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## 🔑 Demo Credentials

| Role      | Email                  | Password       |
| --------- | ---------------------- | -------------- |
| **Admin** | `hire-me@anshumat.org` | `HireMe@2025!` |
| **User**  | `employee1@gmail.com`  | `User@123`     |

> These credentials are pre-seeded in the database on first connection.

---

## 🐛 Known Issues

Currently no issues. If you find any issues, please open a GitHub issue.

---

## 🧪 Postman Collection

- [postman collection](https://techno-sharks.postman.co/workspace/My-Workspace~43ff50a9-d4ac-4239-8167-481c441dbbf2/collection/40678762-c40c15ee-6b74-4e29-bd50-4af3f7b1594a?action=share&creator=40678762)
