from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import get_connection


app = FastAPI(
    title="ExpenseFlow API",
    description="Backend API for ExpenseFlow Expense Tracker",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Transaction(BaseModel):
    title: str
    amount: float
    category: str
    type: str
    date: str


@app.get("/")
def home():
    return {
        "message": "ExpenseFlow API is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/transactions")
def get_transactions():

    connection = get_connection()

    transactions = connection.execute(
        "SELECT * FROM transactions ORDER BY id DESC"
    ).fetchall()

    connection.close()

    return [dict(transaction) for transaction in transactions]


@app.post("/transactions")
def add_transaction(transaction: Transaction):

    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO transactions
        (title, amount, category, type, date)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            transaction.title,
            transaction.amount,
            transaction.category,
            transaction.type,
            transaction.date
        )
    )

    connection.commit()

    transaction_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Transaction added successfully",
        "id": transaction_id
    }


@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int):

    connection = get_connection()

    cursor = connection.execute(
        "DELETE FROM transactions WHERE id = ?",
        (transaction_id,)
    )

    connection.commit()

    deleted = cursor.rowcount

    connection.close()

    if deleted == 0:
        return {
            "message": "Transaction not found"
        }

    return {
        "message": "Transaction deleted successfully"
    }