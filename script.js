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

submit.onclick = function() {
    let values = getInput()
    clearInput()
    addEntry(values)
    updateDisplays()
}

const getInput = function() {
    let values = {}

    values["select"] = inputSelect.value
    values["description"] = inputDescription.value
    values["amount"] = inputAmount.value

    return values
}

const clearInput = function() {
    inputDescription.value = ""
    inputAmount.value = ""
}

const addEntry = function(values) {
    let container = (values["select"] === "+")? incomeContainer : expenseContainer
    let ul = container.querySelector("ul")

    let newLi = document.createElement("li")
    let description = document.createElement("h3")
    let amount = document.createElement("span")
    let crossButton = document.createElement("span")
    let percent = document.createElement("div")

    amount.className = "amount"
    crossButton.className = "cross-button"
    percent.className = "percent"

    description.innerHTML = values["description"]
    amount.innerHTML = (values["select"] === "+")? "+" : "-"
    amount.innerHTML += values["amount"]
    crossButton.innerHTML = "X"
    crossButton.onclick = removeItem

    newLi.appendChild(description)
    newLi.appendChild(amount)
    newLi.appendChild(crossButton)
    newLi.appendChild(percent)
    ul.appendChild(newLi)
}

const updateDisplays = function() {
    let totalIncome = 0
    let totalExpense = 0

    for(let li of incomeContainer.querySelector("ul").children) {
        totalIncome += Number(li.querySelector(".amount").innerHTML)
    }

    for(let li of expenseContainer.querySelector("ul").children) {
        totalExpense += Number(li.querySelector(".amount").innerHTML)
    }

    incomeDisplay.querySelector("span").innerHTML = totalIncome
    expenseDisplay.querySelector("span").innerHTML = totalExpense

    totalBudget.innerHTML = totalIncome + totalExpense

    for(let li of expenseContainer.querySelector("ul").children) {
        updatePercent.call(li)
    }

    expenseDisplay.querySelector(".percent").innerHTML = (totalExpense/totalIncome) * -100
    expenseDisplay.querySelector(".percent").innerHTML += "%"
}

const removeItem = function() {
    this.parentElement.remove()
    updateDisplays()
}

const updatePercent = function() {
    let totalIncome = Number(incomeDisplay.querySelector("span").innerHTML)
    let expense = Number(this.querySelector(".amount").innerHTML)

    let percentElement = this.querySelector(".percent")

    percentElement.innerHTML = (expense/totalIncome) * -100
    percentElement.innerHTML += "%"
}