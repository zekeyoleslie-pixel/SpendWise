SpendWise — Project Audit

Project: SpendWise
Developer: Zekeyo Leslie Ngwenyi
Audit date: 17 October 2026
Project status: Functional and deployed
Current technologies: HTML, CSS, JavaScript
Live demo: https://zekeyoleslie-pixel.github.io/SpendWise/

1. Project Overview

SpendWise is a student-focused expense-tracking application designed to help users record their expenses, monitor their spending, and manage their budget.

The project was built to provide a simple way to organize personal expenses while developing practical frontend web development skills.

2. Current Application Status

The existing website has been tested, and its current features are reported to be working correctly.

The audit identifies no currently confirmed functional bugs. Future development will focus on improving the application’s capabilities, maintainability, security, and long-term usefulness.

3. Existing Features

The following features are part of the current application and have been tested successfully:

* Dashboard for viewing spending information.
* Expense entry and recording.
* Budget and spending calculations.
* Recent Expenses display.
* Expense history.
* Date and year selection.
* Expense categories, including school handouts, transport, and miscellaneous expenses.
* Data persistence using browser storage, as implemented in the current version.
* Charts and expense reporting.
* Excel report export using SheetJS.
* Responsive interface for different screen sizes.

4. Known Bugs

No currently confirmed functional bugs have been identified in this audit.

A year-filtering inconsistency was reported previously, involving an expense appearing in Recent Expenses but not in the main expense section for another selected year. The current application is reported to be working well, so this issue should not be listed as an active bug unless it can still be reproduced.

5. Current Limitations and Areas to Investigate

These are potential limitations of the current frontend-based application, not confirmed failures.

5.1 Browser-based data storage

If expense records are stored in localStorage, they are normally tied to the browser and device where they were saved. They are not automatically synchronized between devices, and clearing browser data may remove them.

5.2 No confirmed shared account system

The current version has not yet been audited for a complete account system with secure authentication and user-specific cloud storage.

5.3 Backup and recovery

A future version could provide clearer backup and restoration options to help users protect their financial records.

5.4 Automated testing

The current application has been tested manually. Automated tests could help prevent regressions as new features are introduced.

5.5 Long-term maintainability

As the project grows, separating application logic into clearer modules and documenting the architecture could make the code easier to maintain.

6. Recommended Future Improvements

These are proposed enhancements, not features claimed to exist in the current application.

Priority 1 — Reliability and usability

* Review date and year filtering to prevent future regressions.
* Add clearer validation and feedback for invalid expense entries.
* Improve empty states, error messages, and confirmation messages.
* Add a confirmation step before deleting records, if deletion is supported.
* Verify how backups and data recovery should work.

Priority 2 — Better financial insights

* Add weekly, monthly, and yearly spending comparisons.
* Show spending trends over time.
* Compare actual expenses against budget limits.
* Introduce configurable budget warnings when spending approaches or exceeds a limit.
* Allow filtering by category and date range.
* Improve report customization, if needed.

Priority 3 — Data protection and accessibility

* Review keyboard navigation and screen-reader accessibility.
* Improve color contrast and readability.
* Make data-storage limitations clear to users.
* Add reliable backup and import/export options where appropriate.

Priority 4 — Full-stack development

* Build a backend using Node.js and Express.
* Design a PostgreSQL database for users, expenses, categories, and budgets.
* Develop an API for creating, retrieving, updating, and deleting expense records.
* Introduce secure authentication and server-side authorization.
* Enable users to access their own records across supported devices.
* Add automated tests for calculations, API endpoints, and data access.
* Deploy and document the full-stack application.

These improvements should be introduced incrementally, with existing working functionality preserved.

7. Proposed Technical Direction

Current version: HTML, CSS, and JavaScript.

Proposed future architecture:

* Frontend: HTML, CSS, and JavaScript.
* Backend: Node.js and Express.
* Database: PostgreSQL.
* API: REST-style endpoints for application data.
* Testing: automated frontend and backend tests.
* Deployment: a suitable hosting environment for both the frontend and backend.

This architecture is a future plan; it does not imply that the backend or database has already been implemented.

8. Development Priorities

1. Preserve the working version and its existing functionality.
2. Review the current code and document how its features operate.
3. Choose improvements based on their usefulness and learning value.
4. Learn the necessary JavaScript concepts before making significant changes.
5. Develop and test the backend and database incrementally.
6. Document meaningful changes through Git commits.
7. Update the README with setup instructions, architecture, screenshots, and the live demo.
8. Test the finished application before describing new features as complete.

9. Conclusion

SpendWise is an existing, deployed expense-tracking application whose current features are reported to be working correctly.

The next stage is not to rebuild the application unnecessarily. It is to preserve what already works, identify meaningful opportunities for improvement, strengthen the codebase, and progressively develop a full-stack version.

The long-term objective is to turn SpendWise into a more maintainable, secure, and capable software project while documenting genuine engineering progress through GitHub.