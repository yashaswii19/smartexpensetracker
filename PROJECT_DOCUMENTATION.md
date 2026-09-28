# Smart Expense Tracking and Financial Analysis System using MongoDB

## College Project Documentation

---

## Abstract

The Smart Expense Tracking and Financial Analysis System is a web-based application designed to help individuals, particularly students and young professionals, manage their personal finances effectively. The system allows users to record income and expenses, categorize transactions, set monthly budgets, and visualize spending patterns through interactive charts. It leverages MongoDB aggregation pipelines to generate financial analytics and rule-based insights that help users make informed financial decisions. The application is built using React.js for the frontend, Node.js with Express.js for the backend, and MongoDB as the primary database with Mongoose ODM for data modeling.

---

## 1. Introduction

Personal finance management is a critical skill that many individuals struggle with. Without a systematic way to track income and expenses, people often lose track of where their money goes, overspend on non-essential categories, and fail to save adequately. The Smart Expense Tracking and Financial Analysis System addresses this problem by providing a centralized platform where users can record every financial transaction, set budgets, monitor their spending in real time, and receive automated insights about their financial habits.

The system uses MongoDB, a NoSQL document database, which provides flexibility in storing transaction data and powerful aggregation capabilities for financial analysis. The frontend is built with React.js and Tailwind CSS, offering a modern, responsive user interface with interactive charts powered by Recharts.

---

## 2. Problem Statement

Existing personal finance management tools are often complex, paid, or not tailored to the needs of students and young professionals who deal with limited income and need careful budget management. There is a need for a simple, free, and effective tool that:

- Allows users to record income and expenses with categorization
- Enables setting and tracking monthly budgets
- Provides visual analytics of spending patterns
- Generates actionable financial insights
- Works across devices (mobile, tablet, desktop)

---

## 3. Objectives

1. To develop a full-stack web application for personal expense tracking
2. To implement secure user authentication using JWT and bcrypt
3. To design a MongoDB database schema with proper relationships between collections
4. To implement CRUD operations for expenses, income, and budgets
5. To use MongoDB aggregation pipelines for financial analytics
6. To create interactive data visualizations using Recharts
7. To generate rule-based financial insights from actual transaction data
8. To provide downloadable CSV reports of financial transactions
9. To ensure a responsive, user-friendly interface

---

## 4. Existing System

Currently, many individuals manage their finances using:

- **Paper-based ledgers** — Prone to loss, damage, and difficult to analyze
- **Spreadsheet applications** — Manual data entry, no automated insights, limited visualization
- **Paid mobile apps** — Often require subscriptions, may not suit Indian context, privacy concerns
- **Bank statements** — Show transactions but lack categorization and budget tracking

### Limitations of Existing Systems

- No automated categorization or analysis
- No budget tracking or alerts
- No visual representation of spending patterns
- No financial insights or recommendations
- Difficult to access across multiple devices

---

## 5. Proposed System

The proposed Smart Expense Tracking and Financial Analysis System is a web-based application that provides:

- **User registration and login** with secure JWT authentication
- **Expense recording** with 10 categories and 5 payment methods
- **Income recording** with 6 income sources
- **Budget management** with category-wise monthly budgets
- **Dashboard** with real-time summary cards and charts
- **Financial analysis** using MongoDB aggregation queries
- **Smart financial insights** generated from actual spending data
- **Reports** with custom date ranges and CSV download
- **Responsive design** accessible on all devices

---

## 6. Scope

The system is designed for individual personal finance management. It covers:

- Recording and managing income and expenses
- Setting and tracking category-wise budgets
- Visualizing spending patterns through charts
- Generating financial insights and reports

### Out of Scope

- Bank account integration or automatic transaction import
- Tax calculation and filing
- Investment portfolio management
- Multi-user shared accounts (e.g., family budgeting)
- Machine learning predictions

---

## 7. Functional Requirements

### 7.1 User Authentication
- The system shall allow new users to register with name, email, and password
- The system shall validate email format and prevent duplicate registrations
- The system shall hash passwords using bcrypt before storage
- The system shall authenticate users using JWT tokens
- The system shall prevent unauthenticated access to protected pages

### 7.2 Expense Management
- The system shall allow users to add, view, edit, and delete expenses
- Each expense shall have amount, category, date, payment method, and description
- The system shall support search by description and category
- The system shall support filtering by category and date range
- The system shall support sorting by amount and date
- The system shall only show expenses belonging to the logged-in user

### 7.3 Income Management
- The system shall allow users to add, view, edit, and delete income records
- Each income record shall have amount, source, date, and description

### 7.4 Budget Management
- The system shall allow users to set category-wise monthly budgets
- The system shall display budget vs actual spending with percentage usage
- The system shall show warnings when spending exceeds or approaches budget limits

### 7.5 Financial Analysis
- The system shall calculate category-wise spending using MongoDB aggregation
- The system shall calculate monthly income vs expenses
- The system shall calculate daily spending trends
- The system shall identify the highest spending category
- The system shall calculate average daily spending
- The system shall calculate savings and savings percentage

### 7.6 Smart Financial Insights
- The system shall generate rule-based insights from user data
- Insights shall include highest category, spending trends, budget usage, and savings rate

### 7.7 Reports
- The system shall generate reports for current month, previous month, or custom date range
- The system shall display summary, category breakdown, and transaction list
- The system shall allow downloading reports as CSV files

---

## 8. Non-Functional Requirements

- **Performance** — Dashboard and analytics should load within 2 seconds
- **Security** — Passwords must be hashed; JWT tokens required for all protected APIs
- **Usability** — Interface must be intuitive and responsive across devices
- **Reliability** — Proper error handling with user-friendly messages
- **Availability** — System should be available whenever the server is running
- **Maintainability** — Clean code structure with separation of concerns
- **Scalability** — MongoDB scales horizontally for large datasets

---

## 9. Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel i3 / AMD equivalent | Intel i5 or higher |
| RAM | 4 GB | 8 GB or more |
| Storage | 10 GB free | 20 GB free |
| Internet | Broadband connection | Stable broadband |

---

## 10. Software Requirements

| Software | Version |
|----------|---------|
| Operating System | Windows 10/11, macOS, or Linux |
| Node.js | v18 or higher |
| MongoDB | v6.0 or higher (or MongoDB Atlas) |
| Browser | Chrome, Firefox, Edge, Safari (latest) |
| Code Editor | VS Code (recommended) |

---

## 11. System Architecture

The application follows a client-server architecture:

### Frontend (Client)
- **React.js** SPA with Tailwind CSS styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for HTTP API calls
- **Context API** for authentication state

### Backend (Server)
- **Node.js + Express.js** REST API server
- **Mongoose ODM** for MongoDB interaction
- **JWT** for authentication tokens
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Database
- **MongoDB** (local or Atlas) for data persistence
- Four collections: Users, Expenses, Incomes, Budgets
- Referential integrity via userId ObjectId references

### Data Flow
1. User interacts with the React frontend
2. Frontend sends HTTP requests to Express API with JWT token
3. Express middleware verifies JWT and extracts user ID
4. Controller queries MongoDB using Mongoose
5. Aggregation pipelines compute analytics
6. JSON response is sent back to frontend
7. Frontend renders data in UI components and charts

---

## 12. Data Flow

```
User Action → React Component → Axios HTTP Request
    → Express Route → JWT Middleware → Controller
    → Mongoose Model → MongoDB (CRUD / Aggregation)
    → JSON Response → React State Update → UI Render
```

### Authentication Flow
```
Register/Login → JWT Token Generated → Stored in localStorage
    → Attached to every API request via Axios interceptor
    → Verified by auth middleware on protected routes
```

---

## 13. Database Design

### MongoDB Collections

#### User Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (unique)",
  "password": "String (bcrypt hash)",
  "createdAt": "Date"
}
```

#### Expense Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "amount": "Number",
  "category": "String (enum)",
  "date": "Date",
  "paymentMethod": "String (enum)",
  "description": "String",
  "createdAt": "Date"
}
```

#### Income Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "amount": "Number",
  "source": "String (enum)",
  "date": "Date",
  "description": "String",
  "createdAt": "Date"
}
```

#### Budget Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "category": "String (enum)",
  "amount": "Number",
  "month": "Number (1-12)",
  "year": "Number",
  "createdAt": "Date"
}
```

### Indexes
- User: unique index on email
- Expense: compound index on (userId, date)
- Income: compound index on (userId, date)
- Budget: unique compound index on (userId, year, month, category)

---

## 14. API Design

### Base URL: `/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | No | Register new user |
| POST | /auth/login | No | Login user |
| GET | /auth/profile | Yes | Get user profile |
| GET | /expenses | Yes | List expenses with filters |
| POST | /expenses | Yes | Create expense |
| PUT | /expenses/:id | Yes | Update expense |
| DELETE | /expenses/:id | Yes | Delete expense |
| GET | /income | Yes | List income records |
| POST | /income | Yes | Create income |
| PUT | /income/:id | Yes | Update income |
| DELETE | /income/:id | Yes | Delete income |
| GET | /budgets | Yes | List budgets |
| POST | /budgets | Yes | Create budget |
| PUT | /budgets/:id | Yes | Update budget |
| DELETE | /budgets/:id | Yes | Delete budget |
| GET | /analytics/summary | Yes | Dashboard summary |
| GET | /analytics/categories | Yes | Category-wise spending |
| GET | /analytics/monthly | Yes | Monthly comparison |
| GET | /analytics/trends | Yes | Daily trends |
| GET | /analytics/budget-comparison | Yes | Budget vs actual |
| GET | /analytics/insights | Yes | Smart insights |

---

## 15. Module Description

### 1. Authentication Module
Handles user registration, login, JWT token generation, and route protection. Passwords are hashed with bcrypt (10 salt rounds). JWT tokens expire after 7 days.

### 2. Expense Module
Provides full CRUD for expense records. Supports search, category filter, date range filter, and sorting. All queries are scoped to the authenticated user.

### 3. Income Module
Provides full CRUD for income records with source categorization. All queries are scoped to the authenticated user.

### 4. Budget Module
Allows setting category-wise monthly budgets. Displays budget vs actual spending with progress bars and overspend warnings. Uses upsert logic to prevent duplicate budgets.

### 5. Analytics Module
Uses MongoDB aggregation pipelines ($match, $group, $sum, $avg, $sort, $project) to compute:
- Total income and expenses
- Category-wise spending
- Monthly income vs expenses
- Daily spending trends
- Budget comparison
- Financial insights

### 6. Reports Module
Generates financial reports for current month, previous month, or custom date range. Displays summary stats, category breakdown, and transaction list. Supports CSV export.

### 7. Frontend Layout Module
Provides the responsive sidebar navigation, summary cards, charts (pie, bar, line), tables, modals, and toast notifications.

---

## 16. Implementation

### Technologies Used
- **Frontend**: React.js 18, Tailwind CSS 3, React Router 6, Recharts, Axios, Lucide React icons
- **Backend**: Node.js, Express.js 4, Mongoose 8, JWT, bcryptjs, CORS, dotenv
- **Database**: MongoDB (local or Atlas)

### Project Structure
```
project/
├── src/                    # Frontend (React)
│   ├── components/         # Reusable UI components
│   │   ├── charts/         # Chart components
│   ├── context/            # Auth context
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── utils/              # Constants and helpers
│   ├── App.tsx             # Main app with routes
│   └── main.tsx            # Entry point
├── server/                 # Backend (Node.js + Express)
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── seed.js             # Sample data seeder
│   └── server.js           # Entry point
├── .env.example            # Frontend env template
├── README.md               # Project documentation
└── PROJECT_DOCUMENTATION.md # This file
```

---

## 17. Testing

### Manual Testing Performed

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| Register with valid data | Account created, JWT returned | Pass |
| Register with duplicate email | Error: account exists | Pass |
| Register with mismatched passwords | Error: passwords do not match | Pass |
| Login with correct credentials | JWT returned, redirect to dashboard | Pass |
| Login with wrong password | Error: invalid credentials | Pass |
| Add expense with valid data | Expense created, appears in list | Pass |
| Edit expense | Changes saved | Pass |
| Delete expense | Expense removed | Pass |
| Filter expenses by category | Only matching expenses shown | Pass |
| Search expenses by description | Matching results shown | Pass |
| Set budget for category | Budget saved, progress shown | Pass |
| Exceed budget | Warning displayed | Pass |
| View dashboard | All summary cards show correct values | Pass |
| View analysis page | Charts render with real data | Pass |
| Generate report | Summary and transactions display | Pass |
| Download CSV | File downloads with correct data | Pass |
| Access protected page without login | Redirect to login | Pass |

---

## 18. Results

The application successfully meets all the specified requirements:

- Users can register, log in, and log out securely
- All CRUD operations for expenses, income, and budgets work correctly
- Dashboard displays real-time financial summary from MongoDB
- Charts (pie, bar, line) render dynamically based on actual data
- MongoDB aggregation pipelines compute category-wise, monthly, and daily analytics
- Smart financial insights are generated from real transaction data
- Reports can be generated for any date range and downloaded as CSV
- The interface is responsive and works on mobile, tablet, and desktop

---

## 19. Advantages

1. **Free and open** — No subscription required
2. **Secure** — JWT authentication with bcrypt password hashing
3. **Real-time analytics** — MongoDB aggregation provides instant insights
4. **Visual insights** — Interactive charts make data easy to understand
5. **Budget tracking** — Category-wise budgets prevent overspending
6. **Smart insights** — Automated recommendations help improve financial habits
7. **Responsive** — Works on all devices
8. **CSV export** — Reports can be downloaded for offline analysis

---

## 20. Limitations

1. No bank account integration or automatic transaction import
2. No multi-user or shared/family budget support
3. Insights are rule-based, not machine learning powered
4. No currency conversion (INR only)
5. No recurring transaction automation
6. No PDF report export (CSV only)
7. Requires manual data entry for each transaction

---

## 21. Future Scope

1. **Bank integration** — Auto-import transactions via Open Banking APIs
2. **Machine learning** — Predict future spending and savings patterns
3. **Mobile app** — React Native app for on-the-go tracking
4. **PDF reports** — Generate printable PDF reports
5. **Recurring transactions** — Automate monthly salary, rent, etc.
6. **Multi-currency** — Support for USD, EUR, etc. with conversion
7. **Shared budgets** — Family or group budget management
8. **Email notifications** — Budget alerts via email
9. **Dark mode** — Theme toggle for night usage
10. **Investment tracking** — Track stocks, mutual funds, etc.

---

## 22. Conclusion

The Smart Expense Tracking and Financial Analysis System successfully demonstrates the use of modern web technologies and MongoDB for building a practical personal finance management tool. The application covers the full spectrum of expense tracking — from recording transactions to generating actionable insights — and showcases MongoDB's powerful aggregation framework for real-time analytics.

The project fulfills all the objectives set out at the beginning: secure authentication, complete CRUD operations, budget management, visual analytics, smart insights, and downloadable reports. The responsive, professional UI makes it suitable for real-world use and academic demonstration.

By leveraging the MERN stack (MongoDB, Express, React, Node.js), the system is built on industry-standard technologies that are widely used in software development, making this project a strong foundation for further enhancement and real-world deployment.
