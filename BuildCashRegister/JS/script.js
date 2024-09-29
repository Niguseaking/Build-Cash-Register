let price = 19.5; 
let cid = [
  ["PENNY", 1.00],
  ["NICKEL", 2.00],
  ["DIME", 3.00],
  ["QUARTER", 4.00],
  ["ONE", 90.00],
  ["FIVE", 50.00],
  ["TEN", 20.00],
  ["TWENTY", 60.00],
  ["ONE HUNDRED", 100.00]
];

// Set Up Constants
const cash = document.getElementById("cash");
const displayChangeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const cashDrawerDisplay = document.getElementById("cash-drawer-display");
const priceScreen = document.getElementById("price-screen");

/* Function to Format Results */
function formatResults(status, change) {
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
  change.forEach(money => (displayChangeDue.innerHTML += `<p>${money[0]}: $${money[1].toFixed(2)}</p>`));
}

/* Function to Check Results */
function checkResults() {
  if (!cash.value) return;
  checkCashRegister();
}

/* Function to Check Cash Register */
function checkCashRegister() {
  const cashAmount = Number(cash.value);
  
  // Check if the cash is less than the price
  if (cashAmount < price) {
    alert("Customer does not have enough money to purchase the item");
    cash.value = '';
    return;
  }

  // Check if the cash is exactly equal to the price
  if (cashAmount === price) {
    displayChangeDue.innerHTML = `<p>No change due - customer paid with exact cash</p>`;
    cash.value = '';
    return;
  }

  let changeDue = cashAmount - price;
  let reversedCid = [...cid].reverse();
  let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  let result = { status: "OPEN", change: [] };
  let totalCID = parseFloat(cid.map(total => total[1]).reduce((p, c) => p + c, 0).toFixed(2));

  // Check if total cash in drawer is less than change due
  if (totalCID < changeDue) {
    displayChangeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
    return;
  }

  // Check if total cash in drawer equals change due
  if (totalCID === changeDue) {
    result.status = "CLOSED";
  }

  for (let i = 0; i < reversedCid.length; i++) {
    let currencyName = reversedCid[i][0];
    let currencyTotal = reversedCid[i][1];
    
    while (changeDue >= denominations[i] && currencyTotal > 0) {
      changeDue -= denominations[i];
      changeDue = parseFloat(changeDue.toFixed(2));
      currencyTotal -= denominations[i];
      if (result.change.find(item => item[0] === currencyName)) {
        result.change.find(item => item[0] === currencyName)[1] += denominations[i];
      } else {
        result.change.push([currencyName, denominations[i]]);
      }
    }

    reversedCid[i][1] = currencyTotal; // Update remaining amount in drawer
  }

  // If there is any change due left, status is INSUFFICIENT_FUNDS
  if (changeDue > 0) {
    displayChangeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
    return;
  }

  // Display results
  formatResults(result.status, result.change);
  updateUI(result.change);
}

//Function to Update UI 
function updateUI(change) {
  const currencyNameMap = {
    PENNY: 'Pennies',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    'ONE HUNDRED': 'Hundreds'
  };

  if (change) {
    change.forEach(changeArr => {
      const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
      targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
    });
  }

  cash.value = '';
  priceScreen.textContent = `Total: $${price.toFixed(2)}`;
  cashDrawerDisplay.innerHTML = `<p><strong>Change in drawer:</strong></p>${cid.map(money => `<p>${currencyNameMap[money[0]]}: $${money[1].toFixed(2)}</p>`).join('')}`;
}

// Apply DOM Event Listeners
purchaseBtn.addEventListener('click', checkResults);

cash.addEventListener('keydown', (e) => {
  if (e.key === "Enter") checkResults();
});

// update the UI
updateUI();