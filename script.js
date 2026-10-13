document.addEventListener("DOMContentLoaded", () => {  
    const MONTHS = [  
        "January",  
        "February",  
        "March",  
        "April",  
        "May",  
        "June",  
        "July",  
        "August",  
        "September",  
        "October",  
        "November",  
        "December"  
    ];  
  
    const CATEGORIES = [  
        "School Handouts",  
        "Transport",  
        "Miscellaneous"  
    ];  
  
    const YEARS = [];  
  
    for (let year = 2026; year <= 2036; year++) {  
        YEARS.push(year);  
    }  
  
    const dashboardPeriod = document.getElementById("dashboard-period");  
    const dashBudget = document.getElementById("dash-budget");  
    const dashSpent = document.getElementById("dash-spent");  
    const dashRemaining = document.getElementById("dash-remaining");  
    const dashboardCategoryBreakdown = document.getElementById("dashboard-category-breakdown");  
    const recentTableBody = document.getElementById("recent-table-body");  
  
    const budgetYearSelect = document.getElementById("budget-year-select");  
    const budgetMonthSelect = document.getElementById("budget-month-select");  
    const budgetAmountInput = document.getElementById("budget-amount-input");  
    const saveBudgetButton = document.getElementById("save-budget");  
    const currentBudgetMonth = document.getElementById("current-budget-month");  
    const currentBudgetAmount = document.getElementById("current-budget-amount");  
  
    const expenseForm = document.getElementById("expense-form");  
    const expenseFormTitle = document.getElementById("expense-form-title");  
    const amountInput = document.getElementById("amount");  
    const categoryInput = document.getElementById("category");  
    const descriptionInput = document.getElementById("description");  
    const expenseDateInput = document.getElementById("expense-date");  
    const saveExpenseButton = document.getElementById("save-expense");  
    const cancelEditButton = document.getElementById("cancel-edit");  
  
    const filterCategory = document.getElementById("filter-category");  
    const filterMonth = document.getElementById("filter-month");  
    const filterYear = document.getElementById("filter-year");  
    const clearFiltersButton = document.getElementById("clear-filters");  
    const expenseCount = document.getElementById("expense-count");  
    const expenseTableBody = document.getElementById("expense-table-body");  
  
    const analysisMonth = document.getElementById("analysis-month");  
    const analysisBudget = document.getElementById("analysis-budget");  
    const analysisSpent = document.getElementById("analysis-spent");  
    const analysisRemaining = document.getElementById("analysis-remaining");  
    const categoryBreakdown = document.getElementById("category-breakdown");  
    const monthlySpendingChart = document.getElementById("monthly-spending-chart");  
  
    const reportYear = document.getElementById("report-year");  
    const reportBudget = document.getElementById("report-budget");  
    const reportSpent = document.getElementById("report-spent");  
    const reportRemaining = document.getElementById("report-remaining");  
    const reportTableBody = document.getElementById("report-table-body");  
    const downloadReportButton = document.getElementById("download-report");  
  
    let expenses = [];  
    let budgets = {};  
    let editingExpenseId = null;  
  
    const savedExpenses = localStorage.getItem("spendwise_expenses");  
    const savedBudgets = localStorage.getItem("spendwise_budgets");  
  
    try {  
        expenses = savedExpenses ? JSON.parse(savedExpenses) : [];  
        budgets = savedBudgets ? JSON.parse(savedBudgets) : {};  
    } catch {  
        expenses = [];  
        budgets = {};  
    }  
  
    if (!Array.isArray(expenses)) {  
        expenses = [];  
    }  
  
    if (!budgets || typeof budgets !== "object" || Array.isArray(budgets)) {  
        budgets = {};  
    }  
  
    expenses = expenses.map(expense => ({  
        ...expense,  
        category:  
            expense.category === "Miscelleneous"  
                ? "Miscellaneous"  
                : expense.category  
    }));  
  
    const today = new Date();  
  
    let selectedMonth = Number(  
        localStorage.getItem("spendwise_selected_month")  
    );  
  
    let selectedYear = Number(  
        localStorage.getItem("spendwise_selected_year")  
    );  
  
    if (!Number.isInteger(selectedMonth) || selectedMonth < 0 || selectedMonth > 11) {  
        selectedMonth = today.getMonth();  
    }  
  
    if (!Number.isInteger(selectedYear) || !YEARS.includes(selectedYear)) {  
        selectedYear = today.getFullYear();  
  
        if (!YEARS.includes(selectedYear)) {  
            selectedYear = 2026;  
        }  
    }  
  
    function saveData() {  
        localStorage.setItem("spendwise_expenses", JSON.stringify(expenses));  
        localStorage.setItem("spendwise_budgets", JSON.stringify(budgets));  
        localStorage.setItem("spendwise_selected_month", String(selectedMonth));  
        localStorage.setItem("spendwise_selected_year", String(selectedYear));  
    }  
  
    function money(value) {  
        const number = Number(value) || 0;  
  
        return `${number.toLocaleString("en-US")} XAF`;  
    }  
  
    function escapeHTML(value) {  
        return String(value ?? "")  
            .replace(/&/g, "&amp;")  
            .replace(/</g, "&lt;")  
            .replace(/>/g, "&gt;")  
            .replace(/"/g, "&quot;")  
            .replace(/'/g, "&#039;");  
    }  
  
    function monthNumber(monthName) {  
        return MONTHS.indexOf(monthName);  
    }  
  
    function periodKey(year, month) {  
        return `${year}-${String(month + 1).padStart(2, "0")}`;  
    }  
  
    function getCurrentBudget(year = selectedYear, month = selectedMonth) {  
        return Number(budgets[periodKey(year, month)]) || 0;  
    }  
  
    function getCurrentExpenses(year = selectedYear, month = selectedMonth) {  
        return expenses.filter(expense => {  
            if (!expense.date) {  
                return false;  
            }  
  
            const date = new Date(`${expense.date}T00:00:00`);  
  
            return (  
                date.getFullYear() === year &&  
                date.getMonth() === month  
            );  
        });  
    }  
  
    function totalSpent(items) {  
        return items.reduce(  
            (total, expense) => total + (Number(expense.amount) || 0),  
            0  
        );  
    }  
  
    function setBalanceClass(element, value) {  
        element.classList.remove("negative", "positive");  
  
        if (value < 0) {  
            element.classList.add("negative");  
        } else if (value > 0) {  
            element.classList.add("positive");  
        }  
    }  
  
    function populateSelect(select, options, includeAll = false) {  
        select.innerHTML = "";  
  
        if (includeAll) {  
            const allOption = document.createElement("option");  
            allOption.value = "all";  
            allOption.textContent = "All";  
            select.appendChild(allOption);  
        }  
  
        options.forEach(option => {  
            const optionElement = document.createElement("option");  
  
            if (typeof option === "object") {  
                optionElement.value = option.value;  
                optionElement.textContent = option.label;  
            } else {  
                optionElement.value = option;  
                optionElement.textContent = option;  
            }  
  
            select.appendChild(optionElement);  
        });  
    }  
  
    function populateSelectors() {  
        populateSelect(  
            budgetYearSelect,  
            YEARS.map(year => ({  
                value: year,  
                label: year  
            }))  
        );  
  
        populateSelect(  
            budgetMonthSelect,  
            MONTHS.map((month, index) => ({  
                value: index,  
                label: month  
            }))  
        );  
  
        populateSelect(  
            filterMonth,  
            MONTHS.map((month, index) => ({  
                value: index,  
                label: month  
            })),  
            true  
        );  
  
        populateSelect(  
            filterYear,  
            YEARS.map(year => ({  
                value: year,  
                label: year  
            })),  
            true  
        );  
  
        populateSelect(  
            analysisMonth,  
            MONTHS.map((month, index) => ({  
                value: index,  
                label: month  
            }))  
        );  
  
        populateSelect(  
            reportYear,  
            YEARS.map(year => ({  
                value: year,  
                label: year  
            }))  
        );  
  
        budgetYearSelect.value = String(selectedYear);  
        budgetMonthSelect.value = String(selectedMonth);  
  
        filterMonth.value = "all";  
        filterYear.value = "all";  
  
        analysisMonth.value = String(selectedMonth);  
        reportYear.value = String(selectedYear);  
    }  
  
    function updateSelectedPeriod() {  
        selectedYear = Number(budgetYearSelect.value);  
        selectedMonth = Number(budgetMonthSelect.value);  
  
        analysisMonth.value = String(selectedMonth);  
  
        saveData();  
        updateAll();  
    }  
  
    function updateDashboard() {  
        const currentExpenses = getCurrentExpenses();  
        const budget = getCurrentBudget();  
        const spent = totalSpent(currentExpenses);  
        const remaining = budget - spent;  
  
        dashboardPeriod.textContent =  
            `${MONTHS[selectedMonth]} ${selectedYear}`;  
  
        dashBudget.textContent = money(budget);  
        dashSpent.textContent = money(spent);  
        dashRemaining.textContent = money(remaining);  
  
        setBalanceClass(dashRemaining, remaining);  
  
        currentBudgetMonth.textContent =  
            `${MONTHS[selectedMonth]} ${selectedYear}`;  
  
        currentBudgetAmount.textContent = money(budget);  
    }  
  
    function renderCategoryBreakdown(container, items, budget = 0) {  
        const totals = {};  
  
        CATEGORIES.forEach(category => {  
            totals[category] = 0;  
        });  
  
        items.forEach(expense => {  
            if (Object.prototype.hasOwnProperty.call(totals, expense.category)) {  
                totals[expense.category] += Number(expense.amount) || 0;  
            }  
        });  
  
        const total = Object.values(totals).reduce(  
            (sum, value) => sum + value,  
            0  
        );  
  
        container.innerHTML = CATEGORIES.map(category => {  
            const value = totals[category];  
  
            let percentage = 0;  
  
            if (budget > 0) {  
                percentage = Math.min((value / budget) * 100, 100);  
            } else if (total > 0) {  
                percentage = (value / total) * 100;  
            }  
  
            return `  
                <div class="category-item">  
                    <div class="category-top">  
                        <span class="category-name">  
                            ${escapeHTML(category)}  
                        </span>  
  
                        <span class="category-value">  
                            ${money(value)}  
                        </span>  
                    </div>  
  
                    <div class="progress-track">  
                        <div  
                            class="progress-bar"  
                            style="width: ${percentage.toFixed(2)}%"  
                        ></div>  
                    </div>  
                </div>  
            `;  
        }).join("");  
    }  
  
    function renderRecentExpenses() {  
        const currentExpenses = getCurrentExpenses()  
            .sort((a, b) => {  
                return new Date(`${b.date}T00:00:00`) -  
                    new Date(`${a.date}T00:00:00`);  
            })  
            .slice(0, 5);  
  
        if (currentExpenses.length === 0) {  
            recentTableBody.innerHTML = `  
                <tr>  
                    <td colspan="4" class="empty-state">  
                        No expenses recorded for this month.  
                    </td>  
                </tr>  
            `;  
  
            return;  
        }  
  
        recentTableBody.innerHTML = currentExpenses.map(expense => `  
            <tr>  
                <td>${escapeHTML(expense.date)}</td>  
                <td>${escapeHTML(expense.description)}</td>  
                <td>${escapeHTML(expense.category)}</td>  
                <td>${money(expense.amount)}</td>  
            </tr>  
        `).join("");  
    }  
  
    function getFilteredExpenses() {  
        return expenses  
            .filter(expense => {  
                if (!expense.date) {  
                    return false;  
                }  
  
                const date = new Date(`${expense.date}T00:00:00`);  
  
                const categoryMatches =  
                    filterCategory.value === "all" ||  
                    expense.category === filterCategory.value;  
  
                const monthMatches =  
                    filterMonth.value === "all" ||  
                    date.getMonth() === Number(filterMonth.value);  
  
                const yearMatches =  
                    filterYear.value === "all" ||  
                    date.getFullYear() === Number(filterYear.value);  
  
                return categoryMatches && monthMatches && yearMatches;  
            })  
            .sort((a, b) => {  
                return new Date(`${b.date}T00:00:00`) -  
                    new Date(`${a.date}T00:00:00`);  
            });  
    }  
  
    function renderExpenseTable() {  
        const filteredExpenses = getFilteredExpenses();  
  
        expenseCount.textContent =  
            `${filteredExpenses.length} ${  
                filteredExpenses.length === 1 ? "expense" : "expenses"  
            }`;  
  
        if (filteredExpenses.length === 0) {  
            expenseTableBody.innerHTML = `  
                <tr>  
                    <td colspan="5" class="empty-state">  
                        No expenses found.  
                    </td>  
                </tr>  
            `;  
  
            return;  
        }  
  
        expenseTableBody.innerHTML = filteredExpenses.map(expense => `  
            <tr>  
                <td>${escapeHTML(expense.date)}</td>  
                <td>${escapeHTML(expense.description)}</td>  
                <td>${escapeHTML(expense.category)}</td>  
                <td>${money(expense.amount)}</td>  
                <td>  
                    <div class="actions">  
                        <button  
                            type="button"  
                            class="edit-button"  
                            data-action="edit"  
                            data-id="${escapeHTML(expense.id)}"  
                        >  
                            Edit  
                        </button>  
  
                        <button  
                            type="button"  
                            class="delete-button"  
                            data-action="delete"  
                            data-id="${escapeHTML(expense.id)}"  
                        >  
                            Delete  
                        </button>  
                    </div>  
                </td>  
            </tr>  
        `).join("");  
    }  
  
    function renderAnalysis() {  
        const month = Number(analysisMonth.value);  
        const year = selectedYear;  
  
        const items = getCurrentExpenses(year, month);  
        const budget = getCurrentBudget(year, month);  
        const spent = totalSpent(items);  
        const remaining = budget - spent;  
  
        analysisBudget.textContent = money(budget);  
        analysisSpent.textContent = money(spent);  
        analysisRemaining.textContent = money(remaining);  
  
        setBalanceClass(analysisRemaining, remaining);  
  
        renderCategoryBreakdown(  
            categoryBreakdown,  
            items,  
            budget  
        );  
    }  
  
    function drawMonthlyChart() {  
        const canvas = monthlySpendingChart;  
        const context = canvas.getContext("2d");  
  
        if (!context) {  
            return;  
        }  
  
        const parentWidth = canvas.parentElement.clientWidth || 600;  
        const width = Math.max(parentWidth, 300);  
        const height = 320;  
  
        const devicePixelRatioValue = window.devicePixelRatio || 1;  
  
        canvas.width = width * devicePixelRatioValue;  
        canvas.height = height * devicePixelRatioValue;  
  
        canvas.style.width = `${width}px`;  
        canvas.style.height = `${height}px`;  
  
        context.setTransform(  
            devicePixelRatioValue,  
            0,  
            0,  
            devicePixelRatioValue,  
            0,  
            0  
        );  
  
        context.clearRect(0, 0, width, height);  
  
        const values = MONTHS.map((_, monthIndex) => {  
            return totalSpent(  
                getCurrentExpenses(selectedYear, monthIndex)  
            );  
        });  
  
        const maxValue = Math.max(...values, 1);  
  
        const padding = {  
            top: 25,  
            right: 20,  
            bottom: 55,  
            left: 60  
        };  
  
        const chartWidth =  
            width - padding.left - padding.right;  
  
        const chartHeight =  
            height - padding.top - padding.bottom;  
  
        const barGap = 7;  
  
        const barWidth =  
            Math.max(  
                10,  
                (chartWidth - barGap * (MONTHS.length - 1)) /  
                MONTHS.length  
            );  
  
        context.strokeStyle = "#cbd5e1";  
        context.fillStyle = "#64748b";  
        context.lineWidth = 1;  
        context.font = "11px Arial";  
  
        for (let i = 0; i <= 4; i++) {  
            const value = (maxValue / 4) * i;  
            const y =  
                padding.top +  
                chartHeight -  
                (value / maxValue) * chartHeight;  
  
            context.beginPath();  
            context.moveTo(padding.left, y);  
            context.lineTo(width - padding.right, y);  
            context.stroke();  
  
            context.textAlign = "right";  
            context.fillText(  
                Math.round(value).toLocaleString(),  
                padding.left - 8,  
                y + 4  
            );  
        }  
  
        values.forEach((value, index) => {  
            const x =  
                padding.left +  
                index * (barWidth + barGap);  
  
            const barHeight =  
                (value / maxValue) * chartHeight;  
  
            const y =  
                padding.top +  
                chartHeight -  
                barHeight;  
  
            context.fillStyle = "#2563eb";  
  
            context.fillRect(  
                x,  
                y,  
                barWidth,  
                barHeight  
            );  
  
            context.fillStyle = "#475569";  
            context.textAlign = "center";  
  
            context.fillText(  
                MONTHS[index].slice(0, 3),  
                x + barWidth / 2,  
                height - 25  
            );  
  
            if (value > 0) {  
                context.fillStyle = "#0f172a";  
  
                context.fillText(  
                    Math.round(value).toLocaleString(),  
                    x + barWidth / 2,  
                    y - 7  
                );  
            }  
        });  
    }  
  
    function renderReports() {  
        const year = Number(reportYear.value);  
  
        let yearlyBudget = 0;  
        let yearlySpent = 0;  
  
        const rows = MONTHS.map((month, monthIndex) => {  
            const budget = getCurrentBudget(year, monthIndex);  
            const spent = totalSpent(  
                getCurrentExpenses(year, monthIndex)  
            );  
  
            const remaining = budget - spent;  
  
            yearlyBudget += budget;  
            yearlySpent += spent;  
  
            return {  
                month,  
                budget,  
                spent,  
                remaining  
            };  
        });  
  
        const yearlyRemaining = yearlyBudget - yearlySpent;  
  
        reportBudget.textContent = money(yearlyBudget);  
        reportSpent.textContent = money(yearlySpent);  
        reportRemaining.textContent = money(yearlyRemaining);  
  
        setBalanceClass(reportRemaining, yearlyRemaining);  
  
        reportTableBody.innerHTML = rows.map(row => `  
            <tr>  
                <td>${escapeHTML(row.month)}</td>  
                <td>${money(row.budget)}</td>  
                <td>${money(row.spent)}</td>  
                <td class="${row.remaining < 0 ? "negative" : "positive"}">  
                    ${money(row.remaining)}  
                </td>  
            </tr>  
        `).join("");  
    }  
  
    function resetExpenseForm() {  
        editingExpenseId = null;  
  
        expenseForm.reset();  
  
        expenseFormTitle.textContent = "Add Expense";  
        saveExpenseButton.textContent = "Add Expense";  
  
        cancelEditButton.classList.add("hidden");  
  
        const defaultDate =  
            `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`;  
  
        expenseDateInput.value = defaultDate;  
    }  
  
    function editExpense(id) {  
        const expense = expenses.find(item => String(item.id) === String(id));  
  
        if (!expense) {  
            return;  
        }  
  
        editingExpenseId = expense.id;  
  
        amountInput.value = expense.amount;  
        categoryInput.value = expense.category;  
        descriptionInput.value = expense.description;  
        expenseDateInput.value = expense.date;  
  
        expenseFormTitle.textContent = "Edit Expense";  
        saveExpenseButton.textContent = "Update Expense";  
  
        cancelEditButton.classList.remove("hidden");  
  
        document.getElementById("add-expense").scrollIntoView({  
            behavior: "smooth"  
        });  
    }  
  
    function deleteExpense(id) {  
        const expense = expenses.find(item => String(item.id) === String(id));  
  
        if (!expense) {  
            return;  
        }  
  
        const confirmed = window.confirm(  
            `Delete "${expense.description}"?`  
        );  
  
        if (!confirmed) {  
            return;  
        }  
  
        expenses = expenses.filter(  
            item => String(item.id) !== String(id)  
        );  
  
        saveData();  
        updateAll();  
    }  
  
    function validatePositiveWholeNumber(value) {  
        const number = Number(value);  
  
        return (  
            Number.isFinite(number) &&  
            number > 0 &&  
            Number.isInteger(number)  
        );  
    }  
  
    saveBudgetButton.addEventListener("click", () => {  
        const year = Number(budgetYearSelect.value);  
        const month = Number(budgetMonthSelect.value);  
        const amount = Number(budgetAmountInput.value);  
  
        if (!YEARS.includes(year)) {  
            window.alert("Please select a valid year.");  
            return;  
        }  
  
        if (month < 0 || month > 11) {  
            window.alert("Please select a valid month.");  
            return;  
        }  
  
        if (!validatePositiveWholeNumber(amount)) {  
            window.alert(  
                "Budget must be a positive whole number."  
            );  
            return;  
        }  
  
        budgets[periodKey(year, month)] = amount;  
  
        selectedYear = year;  
        selectedMonth = month;  
  
        saveData();  
  
        budgetAmountInput.value = "";  
  
        updateAll();  
  
        window.alert(  
            `Budget saved for ${MONTHS[month]} ${year}.`  
        );  
    });  
  
    budgetYearSelect.addEventListener("change", updateSelectedPeriod);  
    budgetMonthSelect.addEventListener("change", updateSelectedPeriod);  
  
    expenseForm.addEventListener("submit", event => {  
        event.preventDefault();  
  
        const amount = Number(amountInput.value);  
        const category = categoryInput.value;  
        const description = descriptionInput.value.trim();  
        const date = expenseDateInput.value;  
  
        if (!validatePositiveWholeNumber(amount)) {  
            window.alert(  
                "Expense amount must be a positive whole number."  
            );  
            return;  
        }  
  
        if (!CATEGORIES.includes(category)) {  
            window.alert("Please select a valid category.");  
            return;  
        }  
  
        if (!description) {  
            window.alert("Please enter a description.");  
            return;  
        }  
  
        if (!date) {  
            window.alert("Please select a date.");  
            return;  
        }  
  
        const expenseDate = new Date(`${date}T00:00:00`);  
  
        if (Number.isNaN(expenseDate.getTime())) {  
            window.alert("Please enter a valid date.");  
            return;  
        }  
  
        const expenseYear = expenseDate.getFullYear();  
  
        if (!YEARS.includes(expenseYear)) {  
            window.alert(  
                "Expense date must be between 2026 and 2036."  
            );  
            return;  
        }  
  
        if (editingExpenseId !== null) {  
            const index = expenses.findIndex(  
                expense =>  
                    String(expense.id) === String(editingExpenseId)  
            );  
  
            if (index !== -1) {  
                expenses[index] = {  
                    ...expenses[index],  
                    amount,  
                    category,  
                    description,  
                    date  
                };  
            }  
        } else {  
            expenses.push({  
                id:  
                    `${Date.now()}-${Math.random()  
                        .toString(36)  
                        .slice(2, 10)}`,  
                amount,  
                category,  
                description,  
                date,  
                createdAt: new Date().toISOString()  
            });  
        }  
  
        selectedYear = expenseDate.getFullYear();  
        selectedMonth = expenseDate.getMonth();  
  
        budgetYearSelect.value = String(selectedYear);  
        budgetMonthSelect.value = String(selectedMonth);  
        analysisMonth.value = String(selectedMonth);  
  
        saveData();  
        resetExpenseForm();  
        updateAll();  
    });  
  
    cancelEditButton.addEventListener("click", () => {  
        resetExpenseForm();  
    });  
  
    expenseTableBody.addEventListener("click", event => {  
        const button = event.target.closest("button");  
  
        if (!button) {  
            return;  
        }  
  
        const action = button.dataset.action;  
        const id = button.dataset.id;  
  
        if (!id) {  
            return;  
        }  
  
        if (action === "edit") {  
            editExpense(id);  
        }  
  
        if (action === "delete") {  
            deleteExpense(id);  
        }  
    });  
  
    filterCategory.addEventListener("change", renderExpenseTable);  
    filterMonth.addEventListener("change", renderExpenseTable);  
    filterYear.addEventListener("change", renderExpenseTable);  
  
    clearFiltersButton.addEventListener("click", () => {  
        filterCategory.value = "all";  
        filterMonth.value = "all";  
        filterYear.value = "all";  
  
        renderExpenseTable();  
    });  
  
    analysisMonth.addEventListener("change", () => {  
        renderAnalysis();  
        drawMonthlyChart();  
    });  
  
    reportYear.addEventListener("change", renderReports);  
  
    downloadReportButton.addEventListener("click", () => {  
        if (typeof XLSX === "undefined") {  
            window.alert(  
                "The Excel library could not be loaded. Check your internet connection and try again."  
            );  
  
            return;  
        }  
  
        const year = Number(reportYear.value);  
  
        const summaryData = [  
            ["SpendWise Annual Report"],  
            [`Year`, year],  
            [],  
            ["Month", "Budget (XAF)", "Spent (XAF)", "Remaining (XAF)"]  
        ];  
  
        const expenseData = [  
            ["Date", "Description", "Category", "Amount (XAF)"]  
        ];  
  
        const monthlyData = [  
            ["Month", "Budget (XAF)", "Spent (XAF)", "Remaining (XAF)"]  
        ];  
  
        let yearlyBudget = 0;  
        let yearlySpent = 0;  
  
        MONTHS.forEach((month, monthIndex) => {  
            const budget = getCurrentBudget(year, monthIndex);  
  
            const monthExpenses =  
                getCurrentExpenses(year, monthIndex);  
  
            const spent = totalSpent(monthExpenses);  
  
            const remaining = budget - spent;  
  
            yearlyBudget += budget;  
            yearlySpent += spent;  
  
            summaryData.push([  
                month,  
                budget,  
                spent,  
                remaining  
            ]);  
  
            monthlyData.push([  
                month,  
                budget,  
                spent,  
                remaining  
            ]);  
  
            monthExpenses.forEach(expense => {  
                expenseData.push([  
                    expense.date,  
                    expense.description,  
                    expense.category,  
                    Number(expense.amount) || 0  
                ]);  
            });  
        });  
  
        const yearlyRemaining =  
            yearlyBudget - yearlySpent;  
  
        summaryData.push([]);  
        summaryData.push([  
            "Yearly Total",  
            yearlyBudget,  
            yearlySpent,  
            yearlyRemaining  
        ]);  
  
        const workbook = XLSX.utils.book_new();  
  
        const summarySheet =  
            XLSX.utils.aoa_to_sheet(summaryData);  
  
        const expenseSheet =  
            XLSX.utils.aoa_to_sheet(expenseData);  
  
        const monthlySheet =  
            XLSX.utils.aoa_to_sheet(monthlyData);  
  
        summarySheet["!cols"] = [  
            { wch: 22 },  
            { wch: 18 },  
            { wch: 18 },  
            { wch: 20 }  
        ];  
  
        expenseSheet["!cols"] = [  
            { wch: 15 },  
            { wch: 30 },  
            { wch: 22 },  
            { wch: 18 }  
        ];  
  
        monthlySheet["!cols"] = [  
            { wch: 18 },  
            { wch: 18 },  
            { wch: 18 },  
            { wch: 20 }  
        ];  
  
        if (summarySheet["B5"]) {  
            summarySheet["B5"].z = "#,##0";  
        }  
  
        XLSX.utils.book_append_sheet(  
            workbook,  
            summarySheet,  
            "Summary"  
        );  
  
        XLSX.utils.book_append_sheet(  
            workbook,  
            expenseSheet,  
            "Expenses"  
        );  
  
        XLSX.utils.book_append_sheet(  
            workbook,  
            monthlySheet,  
            "Monthly Summary"  
        );  
  
        XLSX.writeFile(  
            workbook,  
            `SpendWise_Report_${year}.xlsx`  
        );  
    });  
  
    window.addEventListener("resize", () => {  
        drawMonthlyChart();  
    });  
  
    function updateAll() {  
        updateDashboard();  
  
        const currentExpenses = getCurrentExpenses();  
        const currentBudget = getCurrentBudget();  
  
        renderCategoryBreakdown(  
            dashboardCategoryBreakdown,  
            currentExpenses,  
            currentBudget  
        );  
  
        renderRecentExpenses();  
        renderExpenseTable();  
        renderAnalysis();  
        renderReports();  
        drawMonthlyChart();  
    }  
  
    // Navigation menu: show one app section at a time.
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav") || document.querySelector(".main-nav");
    const pageSections = Array.from(document.querySelectorAll(".app-container > .page-section"));

    function closeNavigationMenu() {
        if (!mainNav || !menuToggle) return;
        mainNav.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function showSection(sectionId) {
        const targetSection = pageSections.find(section => section.id === sectionId);
        if (!targetSection) return;

        pageSections.forEach(section => {
            section.hidden = section !== targetSection;
        });

        if (mainNav) {
            mainNav.querySelectorAll("a").forEach(link => {
                const linkSection = (link.dataset.section || link.getAttribute("href") || "").replace(/^#/, "");
                const isActive = linkSection === sectionId;
                link.classList.toggle("active", isActive);
                if (isActive) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        }

        closeNavigationMenu();

        if (sectionId === "analysis") {
            requestAnimationFrame(() => drawMonthlyChart());
        }
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const opening = mainNav.hidden;
            mainNav.hidden = !opening;
            menuToggle.setAttribute("aria-expanded", String(opening));
            menuToggle.setAttribute("aria-label", opening ? "Close navigation menu" : "Open navigation menu");
        });

        mainNav.addEventListener("click", event => {
            const link = event.target.closest("a");
            if (!link) return;

            const sectionId = (link.dataset.section || link.getAttribute("href") || "").replace(/^#/, "");
            if (!pageSections.some(section => section.id === sectionId)) return;

            event.preventDefault();
            showSection(sectionId);
            history.replaceState(null, "", `#${sectionId}`);
        });

        document.addEventListener("click", event => {
            if (!mainNav.hidden && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                closeNavigationMenu();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && !mainNav.hidden) {
                closeNavigationMenu();
                menuToggle.focus();
            }
        });
    }

    const requestedSection = window.location.hash.slice(1);
    const initialSection = pageSections.some(section => section.id === requestedSection)
        ? requestedSection
        : "dashboard";
    showSection(initialSection);

    populateSelectors();  
  
    resetExpenseForm();  
  
    updateAll();  
});  
