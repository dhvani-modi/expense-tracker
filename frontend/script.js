const API_URL = "http://127.0.0.1:8000";

let allTransactions = [];


// Load Transactions
async function loadTransactions() {

    try {

        const response = await fetch(
            `${API_URL}/transactions`
        );

        if (!response.ok) {
            throw new Error("Unable to load transactions");
        }

        allTransactions = await response.json();

        updateDashboard();
        displayTransactions(allTransactions);

    } catch (error) {

        console.error(error);

        document.getElementById(
            "emptyState"
        ).innerHTML = `
            <i class="bi bi-wifi-off"></i>
            <h4>Unable to connect</h4>
            <p>Make sure the FastAPI backend is running.</p>
        `;
    }
}


// Update Dashboard
function updateDashboard() {

    let income = 0;
    let expense = 0;

    allTransactions.forEach(transaction => {

        const amount = Number(
            transaction.amount
        );

        if (transaction.type === "Income") {
            income += amount;
        } else {
            expense += amount;
        }
    });

    const balance = income - expense;

    document.getElementById(
        "totalIncome"
    ).textContent = formatCurrency(income);

    document.getElementById(
        "totalExpense"
    ).textContent = formatCurrency(expense);

    document.getElementById(
        "totalBalance"
    ).textContent = formatCurrency(balance);

    document.getElementById(
        "transactionCount"
    ).textContent = allTransactions.length;
}


// Display Transactions
function displayTransactions(transactions) {

    const tableBody =
        document.getElementById(
            "transactionTableBody"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );

    tableBody.innerHTML = "";

    if (transactions.length === 0) {

        emptyState.style.display = "block";

        return;
    }

    emptyState.style.display = "none";


    transactions.forEach(transaction => {

        const row =
            document.createElement("tr");


        const amountClass =
            transaction.type === "Income"
                ? "amount-income"
                : "amount-expense";


        const amountSign =
            transaction.type === "Income"
                ? "+"
                : "-";


        const typeClass =
            transaction.type === "Income"
                ? "type-income"
                : "type-expense";


        row.innerHTML = `

            <td>

                <div class="transaction-name">

                    ${escapeHTML(
                        transaction.title
                    )}

                </div>

            </td>


            <td>

                <span class="transaction-category">

                    ${escapeHTML(
                        transaction.category
                    )}

                </span>

            </td>


            <td>

                ${formatDate(
                    transaction.date
                )}

            </td>


            <td>

                <span class="type-badge ${typeClass}">

                    ${transaction.type}

                </span>

            </td>


            <td>

                <span class="${amountClass}">

                    ${amountSign}${formatCurrency(
                        transaction.amount
                    )}

                </span>

            </td>


            <td>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                    title="Delete transaction"
                >

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


// Add Transaction
document.getElementById(
    "transactionForm"
).addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "title"
            ).value.trim();


        const amount =
            Number(
                document.getElementById(
                    "amount"
                ).value
            );


        const category =
            document.getElementById(
                "category"
            ).value;


        const type =
            document.querySelector(
                'input[name="type"]:checked'
            ).value;


        const date =
            document.getElementById(
                "date"
            ).value;


        if (
            !title ||
            !amount ||
            !category ||
            !date
        ) {

            alert(
                "Please fill all fields."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/transactions`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            title: title,

                            amount: amount,

                            category: category,

                            type: type,

                            date: date

                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to add transaction"
                );

            }


            await response.json();


            document.getElementById(
                "transactionForm"
            ).reset();


            document.getElementById(
                "date"
            ).value =
                new Date()
                    .toISOString()
                    .split("T")[0];


            await loadTransactions();


            alert(
                "Transaction added successfully!"
            );


        } catch (error) {

            console.error(error);

            alert(
                "Unable to add transaction. Make sure the backend is running."
            );

        }

    }
);


// Delete Transaction
async function deleteTransaction(transactionId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/transactions/${transactionId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete transaction"
            );

        }


        await response.json();


        await loadTransactions();


        alert(
            "Transaction deleted successfully!"
        );


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete transaction."
        );

    }
}


// Search Transactions
function searchTransactions() {

    const search =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase()
        .trim();


    const filtered =
        allTransactions.filter(
            transaction =>

                transaction.title
                    .toLowerCase()
                    .includes(search)

                ||

                transaction.category
                    .toLowerCase()
                    .includes(search)

                ||

                transaction.type
                    .toLowerCase()
                    .includes(search)
        );


    displayTransactions(filtered);
}


// Open Transaction Form
function openTransactionForm() {

    document
        .getElementById(
            "addTransaction"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


// Format Currency
function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }
    ).format(amount);
}


// Format Date
function formatDate(date) {

    if (!date) {
        return "";
    }


    const parts =
        date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


// Escape HTML
function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// Set Today's Date
document.getElementById(
    "date"
).value =
    new Date()
        .toISOString()
        .split("T")[0];


// Start Application
loadTransactions();