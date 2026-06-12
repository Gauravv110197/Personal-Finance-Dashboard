let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const transactionList =
document.getElementById("transactionList");

let chart;

function addTransaction(){

    const description =
    document.getElementById("description").value;

    const amount =
    Number(document.getElementById("amount").value);

    const type =
    document.getElementById("type").value;

    if(description === "" || amount <= 0){
        alert("Enter valid details");
        return;
    }

    const transaction = {
        description,
        amount,
        type
    };

    transactions.push(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    document.getElementById("description").value="";
    document.getElementById("amount").value="";

    updateUI();
}

function resetDashboard(){
    if(!confirm("Reset dashboard? This will remove all transactions.")){
        return;
    }

    transactions = [];
    localStorage.removeItem("transactions");
    updateUI();
}

function updateUI(){

    transactionList.innerHTML="";

    let income = 0;
    let expense = 0;

    if(transactions.length === 0){
        const li = document.createElement("li");
        li.className = "empty";
        li.textContent = "No transactions yet. Add one to start tracking.";
        transactionList.appendChild(li);
    }

    transactions.forEach((t)=>{

        const li = document.createElement("li");
        li.className = `transaction-item ${t.type}`;

        const formattedAmount = t.amount.toLocaleString("en-IN");

        li.innerHTML =
        `<div class="transaction-details">
            <span class="transaction-desc">${t.description}</span>
            <span class="transaction-badge ${t.type}">${t.type}</span>
         </div>
         <div class="transaction-amount">₹${formattedAmount}</div>`;

        transactionList.appendChild(li);

        if(t.type==="income"){
            income += t.amount;
        }else{
            expense += t.amount;
        }
    });

    const balance = income - expense;

    incomeEl.innerText = `₹${income}`;
    expenseEl.innerText = `₹${expense}`;
    balanceEl.innerText = `₹${balance}`;

    updateChart(income, expense);
}

function updateChart(income, expense){

    const ctx =
    document.getElementById("financeChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type:"pie",
        data:{
            labels:["Income","Expense"],
            datasets:[{
                data:[income, expense],
                backgroundColor:[
                    "#222222",
                    "#777777"
                ]
            }]
        }
    });
}

updateUI();