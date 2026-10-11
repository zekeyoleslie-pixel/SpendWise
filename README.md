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
