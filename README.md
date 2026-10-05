# ExpenseFlow

ExpenseFlow is a full-stack personal expense tracker that helps users manage their income and expenses through a simple and responsive dashboard.

## Features

- Add income and expense transactions
- View total balance
- Calculate total income
- Calculate total expenses
- View total number of transactions
- Search transactions
- Delete transactions
- Categorize transactions
- Responsive dashboard
- REST API based backend
- SQLite database
- FastAPI backend

## Technologies Used

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript

### Backend
- Python
- FastAPI
- Uvicorn

### Database
- SQLite

## Project Structure

```text
expense-tracker/
│
├── backend/
│   ├── database.py
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
How It Works

The frontend provides the user interface for adding and managing transactions.

The JavaScript frontend communicates with the FastAPI backend using REST API requests.

The FastAPI backend processes the requests and stores transaction data in an SQLite database.

Application Flow
User
  ↓
HTML + CSS + Bootstrap
  ↓
JavaScript
  ↓
FastAPI REST API
  ↓
SQLite Database
API Endpoints
Method	Endpoint	Purpose
GET	/	Check API status
GET	/health	Check backend health
GET	/transactions	Get all transactions
POST	/transactions	Add a transaction
DELETE	/transactions/{id}	Delete a transaction
How to Run the Project
1. Start the Backend

Open the terminal inside the backend folder and run:

..\expense-env\Scripts\python.exe -m uvicorn main:app --reload

The API will run at:

http://127.0.0.1:8000
2. Open the Frontend

Open:

frontend/index.html

using VS Code Live Server.

The ExpenseFlow dashboard will open in the browser.

API Documentation

FastAPI automatically provides interactive API documentation.

Open:

http://127.0.0.1:8000/docs
Purpose

This project was developed as a learning project to understand full-stack web development, REST APIs, database integration, and frontend-backend communication.

Developer

Dhvani Modi

B.Tech Computer Science Engineering Student


### Step 2 — Save

`Ctrl + S`

### Step 3 — GitHub par upload

Terminal me:

```powershell
git add README.md
git commit -m "Add project README"
git push