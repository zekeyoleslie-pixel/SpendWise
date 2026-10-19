SpendWise — Student Expense Tracker

Track your spending. Manage your budget. Make smarter financial decisions.

SpendWise is a student-focused expense tracking web application designed to help users record daily expenses, monitor their spending habits, and manage their monthly budgets. Built with HTML, CSS, and JavaScript, it provides a simple interface for organizing expenses and reviewing spending patterns.

🌐 Live Demo: SpendWise

📂 Source Code: GitHub Repository

⸻

📌 Table of Contents

* Overview
* Features
* Technologies Used
* Getting Started
* Project Structure
* Data Storage
* Future Improvements
* Learning Outcomes
* Author
* License

📖 Overview

Managing personal finances can be challenging, especially for students working with limited budgets. SpendWise aims to make expense tracking more organized and accessible by providing a centralized place to record expenses, set budgets, and review financial activity.

The application supports expense categories relevant to student life, including school handouts, transportation, and miscellaneous expenses. It also provides monthly and yearly spending views to help users understand where their money goes.

SpendWise is an ongoing software development project focused on practical problem-solving, frontend development, JavaScript, and progressive feature improvement.

✨ Features

* Expense Tracking: Record and manage individual expenses.
* Budget Management: Set and monitor budgets.
* Dashboard: View spending summaries and recent expenses.
* Expense Categories: Organize expenses into school handouts, transportation, and miscellaneous categories.
* Monthly and Yearly Views: Review financial activity across different periods.
* Spending Visualization: View monthly spending patterns using charts.
* Excel Reports: Export financial information to an Excel-compatible spreadsheet.
* Persistent Storage: Retain saved expenses and budgets using browser local storage.
* Responsive Interface: Designed for convenient use across different screen sizes.
* Date-Based Records: Organize expenses by date and selected reporting period.

🛠️ Technologies Used

Technology	Purpose
HTML5	Application structure
CSS3	Styling, layout, and responsive design
JavaScript	Application logic, calculations, interactivity, and data handling
Browser Local Storage	Saving expenses and budgets locally
Chart.js or custom canvas rendering	Spending visualization, depending on the chart implementation
SheetJS (xlsx)	Excel spreadsheet export

🚀 Getting Started

Prerequisites

You need:

* A modern web browser.
* A code editor, such as Visual Studio Code.
* Git, if you want to clone the repository and contribute through version control.

Installation

1. Clone the repository

git clone https://github.com/zekeyoleslie-pixel/SpendWise.git

2. Navigate to the project directory

cd SpendWise

3. Open the project

Open Index.html in your browser, or open the project folder in Visual Studio Code and use the Live Server extension.

If the project uses external libraries, an internet connection may be required for those libraries to load, depending on how they are included.

📁 Project Structure

SpendWise/
├── Index.html
├── Style.css
├── Script.js
└── README.md

The filenames above represent the intended project structure. Use the exact capitalization and filenames present in the repository.

💾 Data Storage

SpendWise currently uses the browser’s Local Storage API to save expenses, budgets, and selected date settings.

This allows data to remain available when the application is reopened in the same browser on the same origin.

Current limitations:

* Data is stored locally in the browser rather than in a centralized database.
* Data does not automatically synchronize across devices or browsers.
* Clearing the browser’s site data may remove saved records.
* Local storage is not a substitute for secure, server-side storage for sensitive financial information.

🗺️ Future Improvements

Planned improvements may include:

* [ ]	Refine expense filtering and reporting.
* [ ]	Improve the mobile and small-screen experience.
* [ ]	Strengthen form validation and error handling.
* [ ]	Improve accessibility and interface usability.
* [ ]	Expand financial summaries and spending analytics.
* [ ]	Add automated tests for important application features.
* [ ]	Introduce a backend API and database.
* [ ]	Explore secure user authentication and multi-device synchronization.
* [ ]	Add data backup and recovery options.

These improvements will be implemented progressively as the project develops.

🎓 Learning Outcomes

SpendWise provides practical experience in:

* Structuring web applications with HTML.
* Styling interfaces with CSS.
* Using JavaScript to manipulate the DOM.
* Handling user input and form validation.
* Working with arrays, objects, and application state.
* Persisting data with browser local storage.
* Implementing calculations, filtering, and reporting.
* Using Git and GitHub for version control.
* Deploying a website with GitHub Pages.
* Debugging and improving an existing codebase.

👨‍💻 Author

Zekeyo Leslie Ngwenyi

Computer Engineering Student | Aspiring Software Engineer

* LinkedIn: Zekeyo Leslie Ngwenyi

I am building practical software projects to strengthen my programming skills, solve real-world problems, and grow as a software engineer.

📄 License

No license has been specified yet. If you intend to allow others to reuse, modify, or distribute this project, consider adding an appropriate open-source license.

⸻

SpendWise is an educational and personal finance tracking project. It is intended to support expense organization and budgeting, not to provide professional financial advice.

# SpendWise — Frontend Rebuild Audit (Additional)

## Scope
This update rebuilds the frontend using the supplied HTML, CSS and JavaScript as the baseline. The goal is to preserve the existing expense-tracking workflows while fixing the dropdown navigation and making section navigation explicit.

## Navigation requirements addressed
- A visible **Menu** button controls a dropdown navigation on desktop and mobile.
- The **Dashboard is the only visible section on first load**. Budget, Add Expense, Expenses, Analysis and Reports open only after selecting their menu links.
- Selecting a menu item closes the dropdown and shows the selected section. Escape and outside clicks close the dropdown.
- The menu toggle exposes `aria-expanded`, a label and an accessible focus outline.
- Budget and other selected sections use the full available content width instead of being constrained to a small card.

## Preserved existing functionality
- Monthly budget selection and saving
- Add, edit and delete expenses
- Dashboard summary, category breakdown and recent expenses
- Category/month/year expense filters
- Monthly analysis and chart
- Annual report and Excel workbook export (SheetJS CDN required)
- Local browser persistence via the existing `spendwise_*` localStorage keys
- Existing category names, XAF currency and year range

## Additions and fixes
- Search expenses by description, category, date or amount; search combines with existing filters. Clear Filters resets search and all filters.
- Guarded localStorage access with a warning if browser storage is unavailable.
- Responsive dropdown menu, improved focus visibility and reduced-motion support.
- More careful canvas width handling and mobile table/chart overflow behavior.

## Important storage limitation
Data is still stored in the current browser/device using localStorage. It is not synced across devices or users. Clearing browser site data may erase saved expenses and budgets. This frontend update does not add a backend or cloud backup.

## Install safely
1. Back up your current working SpendWise folder.
2. Rename `index.html.txt` to `index.html`, `style.css.txt` to `style.css`, and `script.js.txt` to `script.js`.
3. Keep the three files together in the same folder.
4. Open `index.html` or run with VS Code Live Server.
5. Test the checklist below before committing or deploying.

## Verification checklist
- [ ] Menu button is visible at desktop and mobile widths.
- [ ] Menu opens/closes by button; Escape and outside click close it.
- [ ] Dashboard alone is visible on initial load.
- [ ] Each menu item opens the matching full-width section.
- [ ] Budget saves for selected month/year and updates dashboard.
- [ ] Add, edit, delete and cancel-edit work.
- [ ] Category/month/year filters combine with search and Clear Filters resets all.
- [ ] Analysis chart and annual Excel report work (Excel export requires network access to load SheetJS).
- [ ] Existing localStorage data remains available after replacing files.
- [ ] Test on an actual phone and laptop browser.

## Verification status
Static source checks are run for JavaScript syntax, HTML parsing, duplicate IDs and references to expected elements. These checks do not replace real-browser functional testing across devices. Do not describe the release as fully runtime-tested until the checklist has been completed.

## Suggested commits
Feature update: `feat: fix dropdown navigation and improve responsive expense management`
Audit documentation: `docs: add SpendWise frontend rebuild audit and test checklist`


## Additional update: smart budget meter, flexible categories and Excel readability

- Dashboard ring starts at 100% remaining when a budget exists and there are no expenses. The horizontal bar shows budget used. Both update with changes to the budget and expenses.
- Daily spending guidance divides the remaining balance by the days left in the current month, or the total days in another selected month. It separately handles no budget, exhausted budget and overspending.
- Added general-purpose default categories while retaining School Handouts, Transport and Miscellaneous. Users can add and persist custom categories; they populate the expense form, filters and category analysis. Existing transactions are included so legacy categories remain visible.
- Excel workbook keeps Summary, Expenses and Monthly Summary, and adds report titles, metadata, budget-use percentages, wider columns, styled headers, readable fonts, alternating row fills, totals highlighting, frozen header rows, filters and XAF number formats. The export uses ExcelJS from a CDN, so the first export requires network access to load the library.
- New localStorage key: `spendwise_custom_categories`. Existing expense/budget keys are retained.

### Test checklist
- Set a budget of 12,000 XAF and no expenses: ring should show 100% remaining.
- Add expenses until half the budget is spent, then at the limit, then above it.
- Verify daily guidance changes with balance and selected month.
- Add a custom category such as Rent, refresh the page, then record and filter an expense using it.
- Export the annual workbook and check all three sheets, number formats, widths, filters and frozen headings.
- Test in a real browser at mobile and desktop widths before committing/deploying.

Suggested commits:
- `feat: add smart budget meter and custom expense categories`
- `feat: improve annual Excel report structure and usability`
- `docs: update SpendWise frontend audit for budgeting enhancements`