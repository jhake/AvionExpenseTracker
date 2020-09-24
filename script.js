"use strict";

const totalDisplay = document.getElementById("totalDisplay")
const incomeDisplay = document.getElementById("incomeDisplay")
const expenseDisplay = document.getElementById("expenseDisplay")

const inputForm = document.getElementById("inputForm")
const inputSelect = document.getElementById("inputSelect")
const inputDescription = document.getElementById("inputDescription")
const inputAmount = document.getElementById("inputAmount")
const submit = document.getElementById("submit")

const incomeContainer = document.getElementById("incomeContainer")
const expenseContainer = document.getElementById("expenseContainer")

let entries = []

window.onload = function() {
    // Example entries, as if loaded from database
    entries.push(new Entry("test income", 1000))
    entries.push(new Entry("test expense", -400))
    entries.push(new Entry("test expense", -42400))
    entries.push(new Entry("test expense", -45120))
    entries.push(new Entry("test expense", -43.400))
    entries.push(new Entry("test expense", -400))
    entries.push(new Entry("test expense long long long description", -409879870))
    updateDisplays()
}

const Entry = function(description, amount) {
    this.description = description
    this.amount = amount

    this.element = ( () => {
        let newLi = document.createElement("li")
        let descriptionElement = document.createElement("h3")
        let amountElement = document.createElement("span")
        let crossButton = document.createElement("span")
        let percentContainer = document.createElement("div")
        let percentElement = document.createElement("div")

        percentContainer.className = "percent-container"
        amountElement.className = "amount"
        crossButton.className = "cross-button hidden"
        percentElement.className = "percent"

        percentContainer.appendChild(percentElement)

        descriptionElement.innerHTML = description.substring(0, 30)
        if(description.length > 30){
            descriptionElement.innerHTML += "..."
        }
        console.log(amount)
        if(amount >= 1E6 || amount <= -1E6) {
            amountElement.innerHTML += moneyFormatterShort(amount)
        } else {
            
            amountElement.innerHTML += moneyFormatter(amount)
        }
        crossButton.innerHTML = "×"
        crossButton.onclick = removeItem

        newLi.appendChild(descriptionElement)
        newLi.appendChild(amountElement)
        if(amount >= 0){
            percentElement.classList.add("fake")
        }
        newLi.appendChild(percentContainer)
        newLi.appendChild(crossButton)
        
        newLi.entry = this

        let parent = (amount >= 0)? incomeContainer : expenseContainer
        parent.appendChild(newLi)

        if(amount >= 1E6 || amount <= -1E6) {
            amountElement.onmouseover = onmouseoverAmtHandler
            amountElement.onmouseleave = onmouseleaveAmtHandler
        }

        newLi.onmouseover = onmouseoverLiHandler
        newLi.onmouseleave = onmouseleaveLiHandler

        return newLi
    } ) ();
}

inputForm.onsubmit = function() {
    let values = getInput()
    clearInput()
    addEntry(values)
    updateDisplays()
}

inputSelect.onchange = function() {
    if(inputSelect.value === "+") {
        inputForm.className = "input-plus"
    } else {
        inputForm.className = "input-minus"
    }
}

inputAmount.oninput = function() {
    if (this.value <= 0) {
        this.setCustomValidity('The number must be greater than zero.');
    } else {
        this.setCustomValidity('');
    }
}

const getInput = function() {
    let values = {}

    values["description"] = inputDescription.value
    
    if (inputSelect.value === "+") {
        values["amount"] = Number(inputAmount.value)
    } else {
        values["amount"] = -Number(inputAmount.value)
    }

    return values
}

const clearInput = function() {
    inputDescription.value = ""
    inputAmount.value = ""
}

const addEntry = function(values) {
    let newEntry = new Entry(values.description, values.amount)
    entries.push(newEntry)
}

const updateDisplays = function() {
    let totalIncome = getTotalIncome()
    let totalExpense = getTotalExpense()
    let totalBudget = totalIncome + totalExpense

    incomeDisplay.querySelector("span").innerHTML = moneyFormatter(totalIncome)
    expenseDisplay.querySelector("span").innerHTML = moneyFormatter(totalExpense)

    totalDisplay.innerHTML = moneyFormatter(totalBudget)

    entries.forEach( entry => {
        if (entry.amount < 0) {
            updatePercent.call(entry.element)
        }
    })

    expenseDisplay.querySelector(".percent").innerHTML = percentFormatter(-totalExpense/totalIncome)
    console.log(entries)
}

const removeItem = function() {
    let entry = this.parentElement.entry
    this.parentElement.remove()

    // delete the entry from entries
    const index = entries.indexOf(entry);
    if (index > -1) {
        entries.splice(index, 1);
    }

    updateDisplays()
}

const getTotalIncome = function() {
    let totalIncome = 0
    entries.forEach( entry => {
        if (entry.amount >= 0) {
            totalIncome += entry.amount
        }
    })
    return totalIncome
}

const getTotalExpense = function() {
    let totalExpense = 0
    entries.forEach( entry => {
        if (entry.amount < 0) {
            totalExpense += entry.amount
        }
    })
    return totalExpense
}

const updatePercent = function() {
    let totalIncome = getTotalIncome()
    let expense = this.entry.amount

    let percentElement = this.querySelector(".percent")

    percentElement.innerHTML = percentFormatter(-expense/totalIncome)
}

const onmouseoverLiHandler = function() {
    let crossButton = this.querySelector(".cross-button")
    crossButton.classList.remove("hidden")
}

const onmouseleaveLiHandler = function() {
    let crossButton = this.querySelector(".cross-button")    
    crossButton.classList.add("hidden")
}

const onmouseoverAmtHandler = function() {
    let descriptionElement = this.parentElement.querySelector("h3")

    this.classList.add("expanded")
    descriptionElement.classList.remove("expanded")
    descriptionElement.classList.add("collapsed")

    this.innerHTML = moneyFormatter(this.parentElement.entry.amount)
}

const onmouseleaveAmtHandler = function() {
    let descriptionElement = this.parentElement.querySelector("h3")

    this.classList.remove("expanded")
    descriptionElement.classList.remove("collapsed")

    this.innerHTML = moneyFormatterShort(this.parentElement.entry.amount)
}

var moneyFormatterShort = function(num) {
    let absNum = Math.abs(num)
    let si = [
          { value: 1, symbol: "" },
          { value: 1E3, symbol: "K" },
          { value: 1E6, symbol: "M" },
          { value: 1E9, symbol: "B" },
          { value: 1E12, symbol: "T" },
          { value: 1E15, symbol: "Q" },
    ]
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (absNum >= si[i].value) {
            break;
        }
    }

    let formattedString = (absNum / si[i].value).toFixed(2) + si[i].symbol;
    if(num >= 0) {
        formattedString = "+" + formattedString
    } else {
        formattedString = "-" + formattedString
    }

    return formattedString 
}

var moneyFormatter = function(num) {
    let formattedString = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num)

    if(num >= 0) {
        formattedString = "+" + formattedString
    }

    return formattedString
}

const percentFormatter = function(value) {
    if(value == Infinity || value == -Infinity || isNaN(value)) {
        return ". . ."
    } else if (value >= 10) {
        return ". . ."
    } else {
        return (value*100).toFixed(2) + "%"
    }
}