# Smart Expense Tracking and Financial Analysis System

A full-stack web application for tracking personal expenses, income, and budgets with powerful financial analytics, charts, and smart insights. Built with React, Node.js, Express, and MongoDB.

## Project Description

The Smart Expense Tracking and Financial Analysis System helps users record daily income and expenses, set monthly budgets, and visualize their financial data through interactive charts. It generates rule-based financial insights and downloadable reports, making it ideal for students and individuals who want to manage their money effectively.

## Features

- **User Authentication** — Register and log in with JWT-based authentication and bcrypt password hashing
- **Dashboard** — Summary cards showing total income, expenses, balance, budget, and remaining budget
- **Expense Management** — Full CRUD with search, category filter, date filter, and sorting
- **Income Management** — Full CRUD for income records with source categorization
- **Budget Management** — Set category-wise monthly budgets with progress tracking and overspend warnings
- **Financial Analysis** — Category-wise spending, monthly trends, daily trends, highest category, average daily spending, savings rate
- **Smart Financial Insights** — Auto-generated rule-based recommendations from actual transaction data
- **Reports** — Generate reports for current month, previous month, or custom date range with CSV download
- **Charts** — Pie chart (category breakdown), bar chart (monthly income vs expenses), line chart (daily trends), budget progress bars
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, JavaScript, Tailwind CSS, React Router, Recharts |
| Backend | Node.js, Express.js, REST APIs |
| Database | MongoDB, Mongoose ODM |
| Authentication | JWT, bcryptjs |

## System Architecture

```
Browser (React SPA)
    │
    ├── REST API calls (Axios)
    │
Node.js / Express Server
    │
    ├── /api/auth        → register, login, profile
    ├── /api/expenses    → CRUD expenses
    ├── /api/income      → CRUD income
    ├── /api/budgets     → CRUD budgets
    └── /api/analytics   → summary, categories, monthly, trends, insights
          │
    MongoDB (Atlas or Local)
```

## MongoDB Database Design

### User Collection
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| name | String | Full name |
| email | String | Unique email |
| password | String | Bcrypt hash |
| createdAt | Date | Auto timestamp |

### Expense Collection
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| userId | ObjectId | Ref → User |
| amount | Number | Expense amount |
| category | String | Food, Transport, etc. |
| date | Date | Expense date |
| paymentMethod | String | Cash, UPI, Card, etc. |
| description | String | Optional note |
| createdAt | Date | Auto timestamp |

### Income Collection
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| userId | ObjectId | Ref → User |
| amount | Number | Income amount |
| source | String | Salary, Freelance, etc. |
| date | Date | Income date |
| description | String | Optional note |
| createdAt | Date | Auto timestamp |

### Budget Collection
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| userId | ObjectId | Ref → User |
| category | String | Budget category |
| amount | Number | Budget limit |
| month | Number | 1–12 |
| year | Number | e.g. 2026 |
| createdAt | Date | Auto timestamp |

## Installation Steps

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### 1. Clone the repository

```bash
git clone <repo-url>
cd expense-tracker
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (copy from `.env.example`):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=your_long_random_secret_string_here
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

From the project root:

```bash
npm install
```

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Build a free **M0** cluster
3. Under **Database Access**, create a user with username and password
4. Under **Network Access**, allow access from your IP (or `0.0.0.0/0` for anywhere)
5. Click **Connect → Drivers** and copy the connection string
6. Replace `<password>` with your database user password
7. Paste the full string as `MONGODB_URI` in `server/.env`

Example connection string:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/expense_tracker
```

## Running the Application

### Start the Backend

```bash
cd server
npm start
```

The server runs on `http://localhost:5000`.

### Start the Frontend

From the project root (in a separate terminal):

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

### Seed Sample Data

```bash
cd server
npm run seed
```

This creates a demo user and inserts sample income, expenses, and budgets.

## Sample Credentials

After running the seed script:

| Field | Value |
|-------|-------|
| Email | `demo@expense.com` |
| Password | `password123` |

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/profile` | Get current user profile |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List expenses (supports filters) |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### Income
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/income` | List income records |
| POST | `/api/income` | Create income record |
| PUT | `/api/income/:id` | Update income record |
| DELETE | `/api/income/:id` | Delete income record |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | List budgets |
| POST | `/api/budgets` | Create/update budget |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Dashboard summary stats |
| GET | `/api/analytics/categories` | Category-wise spending |
| GET | `/api/analytics/monthly` | Monthly income vs expenses |
| GET | `/api/analytics/trends` | Daily spending trends |
| GET | `/api/analytics/budget-comparison` | Budget vs actual |
| GET | `/api/analytics/insights` | Smart financial insights |

All endpoints except `/api/auth/register` and `/api/auth/login` require a JWT token in the `Authorization: Bearer <token>` header.

## Screenshots

> _Add screenshots of the dashboard, expense page, budget page, analysis page, and reports page here._

## Future Enhancements

- Email notifications for budget alerts
- Recurring transaction support
- Multi-currency support
- Export reports as PDF
- Dark mode
- Mobile app (React Native)
- Machine learning-based spending predictions
