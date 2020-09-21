"use strict";

const totalBudget = document.getElementById("totalBudget")
const incomeDisplay = document.getElementById("incomeDisplay")
const expenseDisplay = document.getElementById("expenseDisplay")

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
        let percentElement = document.createElement("div")

        amountElement.className = "amount"
        crossButton.className = "cross-button"
        percentElement.className = "percent"

        descriptionElement.innerHTML = description
        amountElement.innerHTML = (amount >= 0)? "+" : ""
        amountElement.innerHTML += amount
        crossButton.innerHTML = "X"
        crossButton.onclick = removeItem

        newLi.appendChild(descriptionElement)
        newLi.appendChild(amountElement)
        newLi.appendChild(crossButton)
        newLi.appendChild(percentElement)
        
        newLi.entry = this

        let parent = (amount >= 0)? incomeContainer : expenseContainer
        parent.appendChild(newLi)

        return newLi
    } ) ();
}

submit.onclick = function() {
    let values = getInput()
    clearInput()
    addEntry(values)
    updateDisplays()
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
    let totalIncome = 0
    let totalExpense = 0

    entries.forEach( entry => {
        if (entry.amount >= 0) {
            totalIncome += entry.amount
        } else {
            totalExpense += entry.amount
        }
    })

    incomeDisplay.querySelector("span").innerHTML = totalIncome
    expenseDisplay.querySelector("span").innerHTML = totalExpense

    totalBudget.innerHTML = totalIncome + totalExpense

    entries.forEach( entry => {
        if (entry.amount < 0) {
            updatePercent.call(entry.element)
        }
    })

    expenseDisplay.querySelector(".percent").innerHTML = (totalExpense/totalIncome) * -100
    expenseDisplay.querySelector(".percent").innerHTML += "%"

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

const updatePercent = function() {
    let totalIncome = Number(incomeDisplay.querySelector("span").innerHTML)
    let expense = Number(this.querySelector(".amount").innerHTML)

    let percentElement = this.querySelector(".percent")

    percentElement.innerHTML = (expense/totalIncome) * -100
    percentElement.innerHTML += "%"
}