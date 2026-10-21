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

    const DEFAULT_CATEGORIES = ["School Handouts", "Transport", "Miscellaneous", "Food & Groceries", "Housing & Rent", "Bills & Utilities", "Health", "Entertainment", "Shopping", "Travel", "Income & Other"];
    let customCategories = [];
    try { const savedCategories = localStorage.getItem("spendwise_custom_categories"); customCategories = savedCategories ? JSON.parse(savedCategories) : []; if (!Array.isArray(customCategories)) customCategories = []; } catch { customCategories = []; }
    let CATEGORIES = [...new Set([...DEFAULT_CATEGORIES, ...customCategories])];

    const YEARS = [];

    for (let year = 2026; year <= 2036; year++) {
        YEARS.push(year);
    }

    const dashboardPeriod = document.getElementById("dashboard-period");
    const dashBudget = document.getElementById("dash-budget");
    const dashSpent = document.getElementById("dash-spent");
    const dashRemaining = document.getElementById("dash-remaining");
    const budgetMeter = document.getElementById("budget-meter");
    const budgetRemainingPercent = document.getElementById("budget-remaining-percent");
    const budgetHealthMessage = document.getElementById("budget-health-message");
    const budgetProgress = document.getElementById("budget-progress");
    const budgetProgressFill = document.getElementById("budget-progress-fill");
    const budgetMeterSpent = document.getElementById("budget-meter-spent");
    const budgetMeterLeft = document.getElementById("budget-meter-left");
    const newCategoryInput = document.getElementById("new-category-input");
    const addCategoryButton = document.getElementById("add-category-button");
    const categoryFeedback = document.getElementById("category-feedback");
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
    const expenseSearch = document.getElementById("expense-search");
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    const expenseCount = document.getElementById("expense-count");
    const expenseTableBody = document.getElementById("expense-table-body");

    const analysisMonth = document.getElementById("analysis-month");
    const analysisBudget = document.getElementById("analysis-budget");
    const analysisSpent = document.getElementById("analysis-spent");
    const analysisRemaining = document.getElementById("analysis-remaining");
    const categoryBreakdown = document.getElementById("category-breakdown");
    const monthlySpendingChart = document.getElementById("monthly-spending-chart");
    const smartInsightsList = document.getElementById("smart-insights-list");
    const categoryBudgetCategory = document.getElementById("category-budget-category");
    const categoryBudgetAmount = document.getElementById("category-budget-amount");
    const saveCategoryBudgetButton = document.getElementById("save-category-budget");
    const categoryBudgetFeedback = document.getElementById("category-budget-feedback");
    const categoryBudgetList = document.getElementById("category-budget-list");
    const trendCurrentTotal = document.getElementById("trend-current-total");
    const trendCurrentLabel = document.getElementById("trend-current-label");
    const trendPreviousTotal = document.getElementById("trend-previous-total");
    const trendPreviousLabel = document.getElementById("trend-previous-label");
    const trendChangeValue = document.getElementById("trend-change-value");
    const trendChangeLabel = document.getElementById("trend-change-label");
    const trendCategoryComparison = document.getElementById("trend-category-comparison");

    const reportYear = document.getElementById("report-year");
    const reportBudget = document.getElementById("report-budget");
    const reportSpent = document.getElementById("report-spent");
    const reportRemaining = document.getElementById("report-remaining");
    const reportTableBody = document.getElementById("report-table-body");
    const downloadReportButton = document.getElementById("download-report");
    const quickAddExpenseButton = document.getElementById("quick-add-expense");
    const welcomeGuide = document.getElementById("welcome-guide");
    const dismissWelcomeGuideButton = document.getElementById("dismiss-welcome-guide");
    const exportBackupButton = document.getElementById("export-backup");
    const chooseBackupButton = document.getElementById("choose-backup");
    const backupFileInput = document.getElementById("backup-file");
    const backupFeedback = document.getElementById("backup-feedback");
    const appToast = document.getElementById("app-toast");
    const restartAppButton = document.getElementById("restart-app");
    const restartFeedback = document.getElementById("restart-feedback");
    let deletedExpenseForUndo = null;
    let undoToastTimer = null;

    let expenses = [];
    let budgets = {};
    let editingExpenseId = null;

    let savedExpenses = null;
    let savedBudgets = null;
    try {
        savedExpenses = localStorage.getItem("spendwise_expenses");
        savedBudgets = localStorage.getItem("spendwise_budgets");
        expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
        budgets = savedBudgets ? JSON.parse(savedBudgets) : {};
    } catch (error) {
        // Continue loading with empty data if browser storage is blocked or corrupt.
        expenses = [];
        budgets = {};
        console.warn("SpendWise could not read browser storage.", error);
    }

    if (!Array.isArray(expenses)) {
        expenses = [];
    }

    if (!budgets || typeof budgets !== "object" || Array.isArray(budgets)) {
        budgets = {};
    }

    let categoryBudgets = {};
    try {
        const savedCategoryBudgets = localStorage.getItem("spendwise_category_budgets");
        categoryBudgets = savedCategoryBudgets ? JSON.parse(savedCategoryBudgets) : {};
        if (!categoryBudgets || typeof categoryBudgets !== "object" || Array.isArray(categoryBudgets)) categoryBudgets = {};
    } catch {
        categoryBudgets = {};
    }

    expenses = expenses.map(expense => ({
        ...expense,
        category:
            expense.category === "Miscelleneous"
                ? "Miscellaneous"
                : expense.category
    }));

    const today = new Date();

    let selectedMonth = today.getMonth();
    let selectedYear = today.getFullYear();
    try {
        const savedMonth = localStorage.getItem("spendwise_selected_month");
        const savedYear = localStorage.getItem("spendwise_selected_year");
        if (savedMonth !== null) selectedMonth = Number(savedMonth);
        if (savedYear !== null) selectedYear = Number(savedYear);
    } catch (error) {
        console.warn("SpendWise could not read the selected period.", error);
    }

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
        try {
            localStorage.setItem("spendwise_expenses", JSON.stringify(expenses));
            localStorage.setItem("spendwise_budgets", JSON.stringify(budgets));
            localStorage.setItem("spendwise_category_budgets", JSON.stringify(categoryBudgets));
            localStorage.setItem("spendwise_selected_month", String(selectedMonth));
            localStorage.setItem("spendwise_selected_year", String(selectedYear));
            const oldWarning = document.getElementById("storage-warning");
            if (oldWarning) oldWarning.remove();
        } catch (error) {
            console.warn("SpendWise could not save to browser storage.", error);
            if (!document.getElementById("storage-warning")) {
                const warning = document.createElement("p");
                warning.id = "storage-warning";
                warning.className = "storage-warning";
                warning.setAttribute("role", "status");
                warning.textContent = "Browser storage is unavailable or full. Your latest changes may not persist after refreshing.";
                const main = document.querySelector(".app-container");
                if (main) main.prepend(warning);
            }
        }
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

    function allCategories() {
        const existing = expenses.map(item => String(item.category || "").trim()).filter(Boolean);
        CATEGORIES = [...new Set([...DEFAULT_CATEGORIES, ...customCategories, ...existing])];
        return CATEGORIES;
    }

    function refreshCategorySelectors() {
        const selected = categoryInput.value;
        const selectedFilter = filterCategory.value || "all";
        const categories = allCategories();
        categoryInput.innerHTML = '<option value="">Select category</option>';
        categories.forEach(category => { const option = document.createElement("option"); option.value = category; option.textContent = category; categoryInput.appendChild(option); });
        if (categories.includes(selected)) categoryInput.value = selected;
        filterCategory.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => { const option = document.createElement("option"); option.value = category; option.textContent = category; filterCategory.appendChild(option); });
        filterCategory.value = categories.includes(selectedFilter) ? selectedFilter : "all";
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

        refreshCategorySelectors();
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
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const now = new Date();
        const isCurrentMonth = now.getFullYear() === selectedYear && now.getMonth() === selectedMonth;
        const daysRemaining = isCurrentMonth ? Math.max(1, daysInMonth - now.getDate() + 1) : daysInMonth;
        const remainingPercent = budget > 0 ? Math.max(0, Math.min(100, remaining / budget * 100)) : 0;
        const usedPercent = budget > 0 ? Math.max(0, Math.min(100, spent / budget * 100)) : 0;
        if (budgetRemainingPercent) budgetRemainingPercent.textContent = `${Math.round(remainingPercent)}%`;
        if (budgetMeterSpent) budgetMeterSpent.textContent = money(spent);
        if (budgetMeterLeft) budgetMeterLeft.textContent = money(remaining);
        if (budgetProgressFill) budgetProgressFill.style.width = `${usedPercent}%`;
        if (budgetProgress) budgetProgress.setAttribute("aria-valuenow", String(Math.round(usedPercent)));
        if (budgetMeter) {
            budgetMeter.style.setProperty("--remaining-angle", `${remainingPercent * 3.6}deg`);
            budgetMeter.classList.toggle("is-warning", remainingPercent <= 25 && remainingPercent > 0);
            budgetMeter.classList.toggle("is-over", remaining < 0);
            budgetMeter.setAttribute("aria-label", budget > 0 ? `${Math.round(remainingPercent)} percent of budget remaining` : "No budget set");
        }
        if (budgetHealthMessage) {
            if (budget <= 0) budgetHealthMessage.textContent = "Set a monthly budget to get a daily spending guide.";
            else if (remaining < 0) budgetHealthMessage.textContent = `You are ${money(Math.abs(remaining))} over budget. Pause non-essential spending and review your expenses.`;
            else if (remaining === 0) budgetHealthMessage.textContent = "You have reached your budget limit for this month.";
            else {
                const dailyLimit = Math.floor(Math.max(0, remaining) / daysRemaining);
                const timing = isCurrentMonth ? `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left this month` : `across ${daysRemaining} days in the selected month`;
                const status = remainingPercent <= 25 ? "You're getting close to your limit." : "You're within your budget.";
                budgetHealthMessage.textContent = `${status} Aim to spend no more than ${money(dailyLimit)} per day (${timing}) to stay within budget.`;
            }
        }

        currentBudgetMonth.textContent =
            `${MONTHS[selectedMonth]} ${selectedYear}`;

        currentBudgetAmount.textContent = money(budget);
    }

    function renderCategoryBreakdown(container, items, budget = 0) {
        const totals = {};

        allCategories().forEach(category => { totals[category] = 0; });

        items.forEach(expense => {
            const category = String(expense.category || "Other").trim() || "Other";
            if (!Object.prototype.hasOwnProperty.call(totals, category)) totals[category] = 0;
            totals[category] += Number(expense.amount) || 0;
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
                const query = (expenseSearch?.value || "").trim().toLocaleLowerCase();
                const searchMatches = !query || [expense.description, expense.category, expense.date, expense.amount]
                    .some(value => String(value ?? "").toLocaleLowerCase().includes(query));

                return categoryMatches && monthMatches && yearMatches && searchMatches;
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
        if (amountInput) amountInput.value = "0";

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

        deletedExpenseForUndo = { ...expense };
        expenses = expenses.filter(item => String(item.id) !== String(id));
        saveData();
        updateAll();
        showToast(`Deleted “${expense.description}”.`, () => {
            if (!deletedExpenseForUndo) return;
            if (!expenses.some(item => String(item.id) === String(deletedExpenseForUndo.id))) {
                expenses.push(deletedExpenseForUndo);
                saveData(); updateAll();
            }
            deletedExpenseForUndo = null;
        });
    }

    function showToast(message, undoAction = null) {
        if (!appToast) return;
        window.clearTimeout(undoToastTimer);
        appToast.replaceChildren();
        const text = document.createElement("span");
        text.textContent = message;
        appToast.appendChild(text);
        if (undoAction) {
            const undoButton = document.createElement("button");
            undoButton.type = "button";
            undoButton.textContent = "Undo";
            undoButton.addEventListener("click", () => { undoAction(); appToast.hidden = true; });
            appToast.appendChild(undoButton);
        }
        appToast.hidden = false;
        undoToastTimer = window.setTimeout(() => { appToast.hidden = true; deletedExpenseForUndo = null; }, undoAction ? 8000 : 3200);
    }

    function startQuickAdd() {
        showSection("add-expense");
        resetExpenseForm();
        const today = new Date();
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        expenseDateInput.value = todayString;
        amountInput.focus();
    }

    function restartSpendWise() {
        const confirmed = window.confirm(
            "Restart SpendWise? This will permanently clear all saved expenses, budgets, and custom categories in this browser. Export a backup first if you want to keep your data."
        );
        if (!confirmed) return;

        const confirmedAgain = window.confirm(
            "Final confirmation: clear all SpendWise records and return to the default state?"
        );
        if (!confirmedAgain) return;

        // Clear only SpendWise-owned keys; never clear all browser localStorage.
        const spendWiseKeys = [
            "spendwise_expenses",
            "spendwise_budgets",
            "spendwise_category_budgets",
            "spendwise_selected_month",
            "spendwise_selected_year",
            "spendwise_custom_categories",
            "spendwise_welcome_dismissed"
        ];
        try {
            spendWiseKeys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error("SpendWise could not clear browser storage.", error);
            if (restartFeedback) restartFeedback.textContent = "Restart could not finish because browser storage is unavailable. No success is reported; check browser storage settings and try again.";
            return;
        }

        expenses = [];
        budgets = {};
        categoryBudgets = {};
        customCategories = [];
        CATEGORIES = [...DEFAULT_CATEGORIES];
        editingExpenseId = null;
        deletedExpenseForUndo = null;
        window.clearTimeout(undoToastTimer);
        if (appToast) appToast.hidden = true;

        const now = new Date();
        selectedMonth = now.getMonth();
        selectedYear = YEARS.includes(now.getFullYear()) ? now.getFullYear() : YEARS[0];
        saveData();
        try { localStorage.setItem("spendwise_custom_categories", JSON.stringify([])); } catch {}

        populateSelectors();
        budgetYearSelect.value = String(selectedYear);
        budgetMonthSelect.value = String(selectedMonth);
        if (analysisMonth) analysisMonth.value = String(selectedMonth);
        if (budgetAmountInput) budgetAmountInput.value = "0";
        resetExpenseForm();
        updateAll();
        if (welcomeGuide) welcomeGuide.hidden = false;
        if (restartFeedback) restartFeedback.textContent = "SpendWise has restarted. Expenses and budgets are cleared, totals are back to 0, and default categories are ready to use.";
        showSection("dashboard");
    }

    function exportDataBackup() {
        const backup = {
            app: "SpendWise",
            backupVersion: 1,
            exportedAt: new Date().toISOString(),
            expenses, budgets, categoryBudgets, customCategories, selectedMonth, selectedYear
        };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `spendwise-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
        if (backupFeedback) backupFeedback.textContent = `Backup exported at ${new Date().toLocaleString()}. Store the file somewhere safe.`;
    }

    function isValidBackup(data) {
        return Boolean(data && data.app === "SpendWise" && data.backupVersion === 1 &&
            Array.isArray(data.expenses) && data.budgets && typeof data.budgets === "object" && !Array.isArray(data.budgets) &&
            Array.isArray(data.customCategories) && data.expenses.every(item => item && item.id !== undefined &&
                Number.isFinite(Number(item.amount)) && typeof item.description === "string" &&
                typeof item.category === "string" && typeof item.date === "string"));
    }

    async function restoreDataBackup(file) {
        if (!file) return;
        try {
            const parsed = JSON.parse(await file.text());
            if (!isValidBackup(parsed)) throw new Error("This file is not a valid SpendWise backup.");
            const summary = `${parsed.expenses.length} expenses, ${Object.keys(parsed.budgets).length} budget entries, and ${parsed.customCategories.length} custom categories`;
            if (!window.confirm(`Restore this backup containing ${summary}? This will replace the data currently stored in this browser.`)) return;
            expenses = parsed.expenses;
            budgets = parsed.budgets;
            // Older Phase 1 backups do not include categoryBudgets.
            categoryBudgets = parsed.categoryBudgets && typeof parsed.categoryBudgets === "object" && !Array.isArray(parsed.categoryBudgets)
                ? parsed.categoryBudgets
                : {};
            customCategories = [...new Set(parsed.customCategories.filter(value => typeof value === "string" && value.trim()).map(value => value.trim()))];
            CATEGORIES = [...new Set([...DEFAULT_CATEGORIES, ...customCategories])];
            if (Number.isInteger(parsed.selectedMonth) && parsed.selectedMonth >= 0 && parsed.selectedMonth <= 11) selectedMonth = parsed.selectedMonth;
            if (Number.isInteger(parsed.selectedYear) && YEARS.includes(parsed.selectedYear)) selectedYear = parsed.selectedYear;
            localStorage.setItem("spendwise_custom_categories", JSON.stringify(customCategories));
            saveData();
            populateSelectors();
            budgetYearSelect.value = String(selectedYear); budgetMonthSelect.value = String(selectedMonth); analysisMonth.value = String(selectedMonth);
            resetExpenseForm(); updateAll();
            if (backupFeedback) backupFeedback.textContent = `Restore complete: ${summary}.`;
        } catch (error) {
            console.error("SpendWise backup restore failed.", error);
            if (backupFeedback) backupFeedback.textContent = error.message || "Could not restore this backup. Your current data has not been intentionally replaced.";
        } finally {
            backupFileInput.value = "";
        }
    }

    function validatePositiveWholeNumber(value) {
        const number = Number(value);

        return (
            Number.isFinite(number) &&
            number > 0 &&
            Number.isInteger(number)
        );
    }

    if (addCategoryButton && newCategoryInput) {
        addCategoryButton.addEventListener("click", () => {
            const name = newCategoryInput.value.trim().replace(/\s+/g, " ");
            if (!name) { categoryFeedback.textContent = "Enter a category name first."; newCategoryInput.focus(); return; }
            const existing = allCategories().find(item => item.toLocaleLowerCase() === name.toLocaleLowerCase());
            if (existing) { categoryInput.value = existing; categoryFeedback.textContent = `“${existing}” already exists and is ready to use.`; newCategoryInput.value = ""; return; }
            customCategories.push(name); customCategories = [...new Set(customCategories)];
            try { localStorage.setItem("spendwise_custom_categories", JSON.stringify(customCategories)); }
            catch { categoryFeedback.textContent = "Could not save the category. Check browser storage settings."; return; }
            refreshCategorySelectors(); categoryInput.value = name; newCategoryInput.value = "";
            categoryFeedback.textContent = `Category “${name}” added and ready to use.`;
        });
        newCategoryInput.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); addCategoryButton.click(); } });
    }

    if (saveCategoryBudgetButton) saveCategoryBudgetButton.addEventListener("click", saveCategoryLimit);
    if (categoryBudgetList) categoryBudgetList.addEventListener("click", event => { const button = event.target.closest("[data-remove-category-budget]"); if (button) removeCategoryLimit(button.dataset.removeCategoryBudget); });

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

        budgetAmountInput.value = "0";

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

        if (!allCategories().includes(category)) {
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
    if (expenseSearch) expenseSearch.addEventListener("input", renderExpenseTable);

    clearFiltersButton.addEventListener("click", () => {
        filterCategory.value = "all";
        filterMonth.value = "all";
        filterYear.value = "all";
        if (expenseSearch) expenseSearch.value = "";
        renderExpenseTable();
    });

    analysisMonth.addEventListener("change", () => {
        renderAnalysis();
        drawMonthlyChart();
    });

    reportYear.addEventListener("change", renderReports);

    downloadReportButton.addEventListener("click", async () => {
        if (typeof ExcelJS === "undefined") {
            window.alert("The Excel export library could not be loaded. Check your internet connection and try again.");
            return;
        }
        const year = Number(reportYear.value);
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "SpendWise";
        workbook.subject = `Annual personal finance report for ${year}`;
        workbook.title = `SpendWise Annual Report ${year}`;
        workbook.created = new Date();
        workbook.modified = new Date();
        const navy = "0F172A";
        const blue = "1D4ED8";
        const paleBlue = "DBEAFE";
        const paleGreen = "DCFCE7";
        const paleRed = "FEE2E2";
        const white = "FFFFFF";
        const gray = "475569";
        const borderColor = "CBD5E1";
        const currencyFormat = '#,##0;[Red]-#,##0;–';

        function styleTitle(sheet, title, lastColumn) {
            sheet.mergeCells(1, 1, 1, lastColumn);
            const cell = sheet.getCell(1, 1);
            cell.value = title;
            cell.font = { name: "Aptos Display", size: 18, bold: true, color: { argb: white } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
            cell.alignment = { vertical: "middle", horizontal: "left" };
            sheet.getRow(1).height = 34;
        }
        function styleHeader(row) {
            row.height = 28;
            row.eachCell(cell => {
                cell.font = { name: "Aptos", size: 11, bold: true, color: { argb: white } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: blue } };
                cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
                cell.border = { bottom: { style: "medium", color: { argb: borderColor } } };
            });
        }
        function styleDataRows(sheet, startRow, endRow, amountColumns, percentColumn = null) {
            for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                const row = sheet.getRow(rowIndex);
                row.height = 22;
                row.eachCell(cell => {
                    cell.font = { name: "Aptos", size: 11, color: { argb: "1E293B" } };
                    cell.alignment = { vertical: "middle" };
                    cell.border = { bottom: { style: "hair", color: { argb: borderColor } } };
                    if (rowIndex % 2 === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F8FAFC" } };
                });
                amountColumns.forEach(col => { sheet.getCell(rowIndex, col).numFmt = currencyFormat; sheet.getCell(rowIndex, col).alignment = { horizontal: "right", vertical: "middle" }; });
                if (percentColumn) sheet.getCell(rowIndex, percentColumn).numFmt = "0%";
            }
        }

        const summary = workbook.addWorksheet("Summary", { views: [{ state: "frozen", ySplit: 5 }] });
        styleTitle(summary, `SPENDWISE | ANNUAL FINANCIAL REPORT`, 5);
        summary.addRow(["Report year", year]);
        summary.addRow(["Currency", "XAF"]);
        summary.addRow([]);
        summary.addRow(["Month", "Budget (XAF)", "Spent (XAF)", "Remaining (XAF)", "Budget Used"]);
        styleHeader(summary.getRow(5));
        let yearlyBudget = 0, yearlySpent = 0;
        MONTHS.forEach((month, monthIndex) => {
            const budget = getCurrentBudget(year, monthIndex);
            const spent = totalSpent(getCurrentExpenses(year, monthIndex));
            const remaining = budget - spent;
            yearlyBudget += budget; yearlySpent += spent;
            summary.addRow([month, budget, spent, remaining, budget > 0 ? spent / budget : 0]);
        });
        const yearlyRemaining = yearlyBudget - yearlySpent;
        summary.addRow(["YEARLY TOTAL", yearlyBudget, yearlySpent, yearlyRemaining, yearlyBudget > 0 ? yearlySpent / yearlyBudget : 0]);
        styleDataRows(summary, 6, 17, [2, 3, 4], 5);
        const totalRow = summary.getRow(18);
        totalRow.font = { name: "Aptos", size: 11, bold: true, color: { argb: navy } };
        totalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: yearlyRemaining < 0 ? paleRed : paleGreen } };
        [2,3,4].forEach(col => totalRow.getCell(col).numFmt = currencyFormat);
        totalRow.getCell(5).numFmt = "0%";
        summary.columns = [{ width: 25 }, { width: 20 }, { width: 20 }, { width: 22 }, { width: 18 }];
        summary.autoFilter = { from: "A5", to: "E17" };

        const monthly = workbook.addWorksheet("Monthly Summary", { views: [{ state: "frozen", ySplit: 4 }] });
        styleTitle(monthly, "SPENDWISE | MONTHLY SUMMARY", 5);
        monthly.addRow(["Report year", year]); monthly.addRow([]);
        monthly.addRow(["Month", "Budget (XAF)", "Spent (XAF)", "Remaining (XAF)", "Budget Used"]);
        styleHeader(monthly.getRow(4));
        MONTHS.forEach((month, monthIndex) => {
            const budget = getCurrentBudget(year, monthIndex); const spent = totalSpent(getCurrentExpenses(year, monthIndex));
            monthly.addRow([month, budget, spent, budget - spent, budget > 0 ? spent / budget : 0]);
        });
        monthly.addRow(["YEARLY TOTAL", yearlyBudget, yearlySpent, yearlyRemaining, yearlyBudget > 0 ? yearlySpent / yearlyBudget : 0]);
        styleDataRows(monthly, 5, 16, [2,3,4], 5);
        const monthlyTotal = monthly.getRow(17); monthlyTotal.font = { name: "Aptos", size: 11, bold: true, color: { argb: navy } }; monthlyTotal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: yearlyRemaining < 0 ? paleRed : paleGreen } };
        [2,3,4].forEach(col => monthlyTotal.getCell(col).numFmt = currencyFormat); monthlyTotal.getCell(5).numFmt = "0%";
        monthly.columns = [{ width: 25 }, { width: 20 }, { width: 20 }, { width: 22 }, { width: 18 }]; monthly.autoFilter = { from: "A4", to: "E16" };

        const transactions = workbook.addWorksheet("Expenses", { views: [{ state: "frozen", ySplit: 4 }] });
        styleTitle(transactions, "SPENDWISE | TRANSACTION REGISTER", 4);
        transactions.addRow(["Report year", year]); transactions.addRow([]);
        transactions.addRow(["Date", "Description", "Category", "Amount (XAF)"]);
        styleHeader(transactions.getRow(4));
        const yearExpenses = expenses.filter(item => item.date && new Date(`${item.date}T00:00:00`).getFullYear() === year).sort((a,b) => a.date.localeCompare(b.date));
        yearExpenses.forEach(item => transactions.addRow([new Date(`${item.date}T00:00:00`), item.description, item.category, Number(item.amount) || 0]));
        if (!yearExpenses.length) transactions.addRow(["No expenses recorded for this year", "", "", 0]);
        styleDataRows(transactions, 5, Math.max(5, transactions.rowCount), [4]);
        transactions.columns = [{ width: 16 }, { width: 42 }, { width: 28 }, { width: 20 }];
        transactions.autoFilter = { from: "A4", to: `D${Math.max(4, transactions.rowCount)}` };
        transactions.getColumn(1).numFmt = "yyyy-mm-dd";
        transactions.getColumn(4).numFmt = currencyFormat;
        transactions.eachRow(row => row.eachCell(cell => { cell.alignment = { ...cell.alignment, vertical: "middle", wrapText: cell.col === 2 || cell.col === 3 }; }));

        try {
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a"); link.href = url; link.download = `SpendWise_Report_${year}.xlsx`;
            document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
        } catch (error) {
            console.error("SpendWise Excel export failed:", error);
            window.alert("The report could not be created. Please try again.");
        }
    });

    window.addEventListener("resize", () => {
        drawMonthlyChart();
    });

    // Dropdown navigation: dashboard is the default cover page; other sections open on selection.
    const pageSections = Array.from(document.querySelectorAll(".page-section"));
    const navLinks = mainNav ? Array.from(mainNav.querySelectorAll("a[href^='#']")) : [];

    function closeMenu() {
        if (!mainNav || !menuToggle) return;
        mainNav.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function showSection(sectionId) {
        const targetId = pageSections.some(section => section.id === sectionId) ? sectionId : "dashboard";
        pageSections.forEach(section => { section.hidden = section.id !== targetId; });
        navLinks.forEach(link => {
            const active = link.getAttribute("href") === `#${targetId}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
        closeMenu();
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const opening = mainNav.hidden;
            mainNav.hidden = !opening;
            menuToggle.setAttribute("aria-expanded", String(opening));
            menuToggle.setAttribute("aria-label", opening ? "Close navigation menu" : "Open navigation menu");
        });
        navLinks.forEach(link => link.addEventListener("click", event => {
            event.preventDefault();
            showSection(link.getAttribute("href").slice(1));
        }));
        document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
        document.addEventListener("click", event => {
            if (!event.target.closest(".header-navigation")) closeMenu();
        });
    }


    function categoryBudgetKey(year, month, category) {
        return `${periodKey(year, month)}::${category}`;
    }

    function getCategorySpend(category, year = selectedYear, month = selectedMonth) {
        return totalSpent(getCurrentExpenses(year, month).filter(item => String(item.category || "").trim() === category));
    }

    function renderSmartInsights() {
        if (!smartInsightsList) return;
        const items = getCurrentExpenses();
        const budget = getCurrentBudget();
        const spent = totalSpent(items);
        const remaining = budget - spent;
        const insights = [];
        const now = new Date();
        const isCurrentMonth = now.getFullYear() === selectedYear && now.getMonth() === selectedMonth;
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const daysLeft = isCurrentMonth ? Math.max(1, daysInMonth - now.getDate() + 1) : daysInMonth;

        if (items.length === 0) {
            insights.push({type:"positive", title:"Start with a clear picture", message:"No expenses are recorded for this month yet. Add expenses as they happen to unlock more useful comparisons."});
        } else {
            const categoryTotals = {};
            items.forEach(item => {
                const category = String(item.category || "Other").trim() || "Other";
                categoryTotals[category] = (categoryTotals[category] || 0) + (Number(item.amount) || 0);
            });
            const ranked = Object.entries(categoryTotals).sort((a,b) => b[1] - a[1]);
            if (ranked.length) {
                const share = spent > 0 ? Math.round(ranked[0][1] / spent * 100) : 0;
                insights.push({type:"", title:`Largest category: ${ranked[0][0]}`, message:`${money(ranked[0][1])} is ${share}% of your recorded spending this month. Check whether this matches your priorities.`});
            }
            const previousDate = new Date(selectedYear, selectedMonth - 1, 1);
            const previousSpent = totalSpent(getCurrentExpenses(previousDate.getFullYear(), previousDate.getMonth()));
            if (previousSpent > 0) {
                const difference = spent - previousSpent;
                const pct = Math.round(Math.abs(difference) / previousSpent * 100);
                if (difference > 0) insights.push({type:"warning", title:"Spending is higher than last month", message:`You've recorded ${money(difference)} more than the previous month (${pct}% higher). Review recent purchases to see what changed.`});
                else if (difference < 0) insights.push({type:"positive", title:"Spending is lower than last month", message:`You've recorded ${money(Math.abs(difference))} less than the previous month (${pct}% lower). Keep the habits that are working.`});
                else insights.push({type:"positive", title:"Spending matches last month", message:"Your recorded spending is the same as the previous month so far."});
            } else {
                insights.push({type:"", title:"Build a month-to-month history", message:"Record expenses in the previous month to compare trends over time."});
            }
        }

        if (budget > 0) {
            const usedPercent = Math.round(spent / budget * 100);
            if (remaining < 0) insights.push({type:"warning", title:"Monthly budget exceeded", message:`You are ${money(Math.abs(remaining))} over the overall budget. Review the category limits and consider pausing optional spending.`});
            else if (usedPercent >= 75) insights.push({type:"warning", title:"Most of your budget is used", message:`You've used ${usedPercent}% of the overall budget with ${daysLeft} day${daysLeft === 1 ? "" : "s"} in the selected month.`});
            else insights.push({type:"positive", title:"Overall budget check", message:`You've used ${usedPercent}% of your overall monthly budget. ${money(Math.floor(remaining / daysLeft))} per day would use the remaining balance evenly across ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`});
        } else {
            insights.push({type:"", title:"Set an overall budget", message:"A monthly budget helps SpendWise calculate remaining funds and give more relevant spending guidance."});
        }

        const categoryLimits = Object.entries(categoryBudgets)
            .filter(([key, value]) => key.startsWith(`${periodKey(selectedYear, selectedMonth)}::`) && Number(value) > 0)
            .map(([key, value]) => ({category:key.split("::").slice(1).join("::"), limit:Number(value)}));
        categoryLimits.forEach(item => {
            const categorySpent = getCategorySpend(item.category);
            const pct = Math.round(categorySpent / item.limit * 100);
            if (pct >= 100) insights.push({type:"warning", title:`${item.category} limit reached`, message:`This category has used ${pct}% of its ${money(item.limit)} limit.`});
            else if (pct >= 75) insights.push({type:"warning", title:`${item.category} is nearing its limit`, message:`${money(categorySpent)} of ${money(item.limit)} used (${pct}%).`});
        });

        smartInsightsList.innerHTML = insights.map(item => `
            <article class="smart-insight ${item.type}">
                <strong>${escapeHTML(item.title)}</strong>
                <p>${escapeHTML(item.message)}</p>
            </article>
        `).join("");
    }

    function renderCategoryBudgets() {
        if (!categoryBudgetCategory || !categoryBudgetList) return;
        const currentSelection = categoryBudgetCategory.value;
        const categories = allCategories();
        categoryBudgetCategory.innerHTML = categories.map(category => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
        if (categories.includes(currentSelection)) categoryBudgetCategory.value = currentSelection;

        const prefix = `${periodKey(selectedYear, selectedMonth)}::`;
        const entries = Object.entries(categoryBudgets).filter(([key, value]) => key.startsWith(prefix) && Number(value) > 0)
            .map(([key, limit]) => ({key, category:key.slice(prefix.length), limit:Number(limit)}))
            .sort((a,b) => a.category.localeCompare(b.category));

        if (!entries.length) {
            categoryBudgetList.innerHTML = '<div class="phase2-empty">No category limits set for this month. Choose a category and add a limit above.</div>';
            return;
        }

        categoryBudgetList.innerHTML = entries.map(entry => {
            const spent = getCategorySpend(entry.category);
            const remaining = entry.limit - spent;
            const percent = Math.min(100, Math.round(spent / entry.limit * 100));
            const stateClass = spent > entry.limit ? "over-limit" : percent >= 75 ? "near-limit" : "";
            const status = remaining < 0 ? `${money(Math.abs(remaining))} over limit` : `${money(remaining)} left`;
            return `<article class="category-budget-row">
                <div class="category-budget-row-top"><strong>${escapeHTML(entry.category)}</strong><span>${money(spent)} / ${money(entry.limit)}</span></div>
                <div class="category-budget-track" role="progressbar" aria-label="${escapeHTML(entry.category)} budget used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100, percent)}"><div class="category-budget-fill ${stateClass}" style="width:${percent}%"></div></div>
                <div class="category-budget-footer"><span>${percent}% used · ${escapeHTML(status)}</span><button type="button" data-remove-category-budget="${escapeHTML(entry.key)}">Remove limit</button></div>
            </article>`;
        }).join("");
    }

    function renderMonthlyTrends() {
        if (!trendCurrentTotal) return;
        const currentDate = new Date(selectedYear, selectedMonth, 1);
        const previousDate = new Date(selectedYear, selectedMonth - 1, 1);
        const currentItems = getCurrentExpenses(currentDate.getFullYear(), currentDate.getMonth());
        const previousItems = getCurrentExpenses(previousDate.getFullYear(), previousDate.getMonth());
        const currentTotal = totalSpent(currentItems);
        const previousTotal = totalSpent(previousItems);
        trendCurrentTotal.textContent = money(currentTotal);
        trendCurrentLabel.textContent = `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        trendPreviousTotal.textContent = money(previousTotal);
        trendPreviousLabel.textContent = `${MONTHS[previousDate.getMonth()]} ${previousDate.getFullYear()}`;

        if (!previousItems.length) {
            trendChangeValue.textContent = "—";
            trendChangeValue.className = "";
            trendChangeLabel.textContent = "Add previous-month records to compare";
        } else {
            const difference = currentTotal - previousTotal;
            const percentage = previousTotal > 0 ? Math.round(Math.abs(difference) / previousTotal * 100) : null;
            trendChangeValue.textContent = `${difference > 0 ? "+" : difference < 0 ? "−" : ""}${money(Math.abs(difference))}`;
            trendChangeValue.className = difference > 0 ? "trend-up" : difference < 0 ? "trend-down" : "";
            trendChangeLabel.textContent = difference === 0 ? "No change" : `${percentage === null ? "Previous month was zero" : `${percentage}%`} ${difference > 0 ? "increase" : "decrease"}`;
        }

        const categories = [...new Set([...currentItems, ...previousItems].map(item => String(item.category || "Other").trim() || "Other"))];
        if (!categories.length) {
            trendCategoryComparison.innerHTML = '<div class="phase2-empty">Record expenses in two months to compare category trends.</div>';
            return;
        }
        const rows = categories.map(category => {
            const current = totalSpent(currentItems.filter(item => (String(item.category || "Other").trim() || "Other") === category));
            const previous = totalSpent(previousItems.filter(item => (String(item.category || "Other").trim() || "Other") === category));
            const max = Math.max(current, previous, 1);
            const delta = current - previous;
            const deltaText = delta === 0 ? "No change" : `${delta > 0 ? "+" : "−"}${money(Math.abs(delta))}`;
            return `<div class="trend-category-row">
                <span class="trend-category-name">${escapeHTML(category)}</span>
                <div class="trend-category-bars" aria-label="${escapeHTML(category)}: current ${money(current)}, previous ${money(previous)}">
                    <div class="trend-bar-track"><div class="trend-bar-fill" style="width:${current / max * 100}%"></div></div>
                    <div class="trend-bar-track"><div class="trend-bar-fill previous" style="width:${previous / max * 100}%"></div></div>
                </div>
                <span class="trend-category-change">${escapeHTML(deltaText)}</span>
            </div>`;
        }).join("");
        trendCategoryComparison.innerHTML = `<p class="field-hint">Bars show selected month first (blue), previous month second (grey).</p>${rows}`;
    }

    function saveCategoryLimit() {
        const category = categoryBudgetCategory.value;
        const amount = Number(categoryBudgetAmount.value);
        if (!category) {
            categoryBudgetFeedback.textContent = "Choose a category first.";
            return;
        }
        if (!Number.isFinite(amount) || amount <= 0) {
            categoryBudgetFeedback.textContent = "Enter a category limit greater than 0 XAF.";
            categoryBudgetAmount.focus();
            return;
        }
        categoryBudgets[categoryBudgetKey(selectedYear, selectedMonth, category)] = Math.round(amount);
        saveData();
        categoryBudgetAmount.value = "0";
        categoryBudgetFeedback.textContent = `${category} limit saved for ${MONTHS[selectedMonth]} ${selectedYear}.`;
        updateAll();
    }

    function removeCategoryLimit(key) {
        if (!Object.prototype.hasOwnProperty.call(categoryBudgets, key)) return;
        if (!window.confirm("Remove this category limit? Your expenses will not be deleted.")) return;
        delete categoryBudgets[key];
        saveData();
        updateAll();
    }

    function updateAll() {
        refreshCategorySelectors();
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
        renderSmartInsights();
        renderCategoryBudgets();
        renderMonthlyTrends();
        drawMonthlyChart();
    }

    if (quickAddExpenseButton) quickAddExpenseButton.addEventListener("click", startQuickAdd);
    if (restartAppButton) restartAppButton.addEventListener("click", restartSpendWise);
    if (exportBackupButton) exportBackupButton.addEventListener("click", exportDataBackup);
    if (chooseBackupButton && backupFileInput) chooseBackupButton.addEventListener("click", () => backupFileInput.click());
    if (backupFileInput) backupFileInput.addEventListener("change", () => restoreDataBackup(backupFileInput.files && backupFileInput.files[0]));
    if (welcomeGuide && dismissWelcomeGuideButton) {
        let guideDismissed = false;
        try { guideDismissed = localStorage.getItem("spendwise_welcome_dismissed") === "true"; } catch {}
        if (!guideDismissed && expenses.length === 0 && Object.keys(budgets).length === 0) welcomeGuide.hidden = false;
        dismissWelcomeGuideButton.addEventListener("click", () => {
            welcomeGuide.hidden = true;
            try { localStorage.setItem("spendwise_welcome_dismissed", "true"); } catch {}
        });
    }

    populateSelectors();

    resetExpenseForm();

    updateAll();
});
