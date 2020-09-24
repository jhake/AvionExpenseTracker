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
        crossButton.className = "cross-button"
        percentElement.className = "percent"

        percentContainer.appendChild(percentElement)

        descriptionElement.innerHTML = description.substring(0, 25)
        if(description.length > 25){
            descriptionElement.innerHTML += "..."
        }
        amountElement.innerHTML = (amount >= 0)? "+" : ""
        amountElement.innerHTML += (moneyFormatter(amount))
        crossButton.innerHTML = "×"
        crossButton.onclick = removeItem

        newLi.appendChild(descriptionElement)
        newLi.appendChild(amountElement)
        if(amount < 0){
            newLi.appendChild(percentContainer)
        }
        newLi.appendChild(crossButton)
        
        newLi.entry = this

        let parent = (amount >= 0)? incomeContainer : expenseContainer
        parent.appendChild(newLi)

        newLi.onmouseover = onmouseoverHandler
        newLi.onmouseleave = onmouseleaveHandler

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

    incomeDisplay.querySelector("span").innerHTML = "+" + moneyFormatter(totalIncome)
    expenseDisplay.querySelector("span").innerHTML = moneyFormatter(totalExpense)

    if(totalBudget >= 0) {
        totalDisplay.innerHTML = "+"
    } else {
        totalDisplay.innerHTML = ""
    }
    totalDisplay.innerHTML += moneyFormatter(totalBudget)

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

const onmouseoverHandler = function() {
    let crossButton = this.querySelector(".cross-button")
    crossButton.classList.add("displayed")
}

const onmouseleaveHandler = function() {
    let crossButton = this.querySelector(".cross-button")
    crossButton.classList.remove("displayed")
}

var moneyFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}).format

const percentFormatter = function(value) {
    if(value == Infinity || value == -Infinity || isNaN(value)) {
        return ". . ."
    } else if (value >= 10) {
        return ". . ."
    } else {
        return (value*100).toFixed(2) + "%"
    }
}