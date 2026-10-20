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


## Latest verification run

- JavaScript syntax check: passed using Node.js after copying the `.txt` source to a temporary `.js` file.
- HTML parsing: passed.
- Duplicate HTML IDs: none found.
- Label and navigation references: all resolved.
- Default page visibility: Dashboard visible; five other sections initially hidden.
- Source inspection confirms budget-meter logic, daily guidance, custom-category persistence, and a three-sheet ExcelJS workbook are present.
- Not verified in a real browser: interactive workflows, actual downloaded workbook rendering, and device-specific layout. Complete the checklist above before deployment.
- Browser storage remains local to the browser/device; this is not cloud backup.

# SpendWise Phase 1 test checklist

Before replacing the live site, test a copy of the project locally.

- [ ] Existing expenses, budgets, categories, filters, charts, reports and Excel export still work.
- [ ] Quick Add opens the expense form, sets today's date and focuses Amount.
- [ ] Welcome guide appears only for a new/empty setup and can be dismissed.
- [ ] Export Backup downloads a JSON file.
- [ ] Restore Backup rejects malformed files and asks before replacing existing data.
- [ ] Export a backup, add a test expense, restore the backup, and verify the test expense is removed and original data returns.
- [ ] Delete a test expense, click Undo within 8 seconds, and verify it returns in the list and totals.
- [ ] Test keyboard focus and reduced-motion behavior.
- [ ] Test on laptop and phone widths.
- [ ] Test with browser storage disabled/full if possible; confirm the warning is clear.

Do not deploy until these manual browser checks pass. Static syntax/HTML checks passed during generation, but a real browser interaction test has not been completed here.


## Restart and zero defaults
- Confirm the amount and budget inputs start at `0`; the app still rejects zero as a saved expense or budget.
- Record test expenses, save a budget, and add a custom category.
- Use Restart & Clear All Data and accept both confirmations.
- Verify expenses, budgets, and custom categories are cleared; default categories remain.
- Verify dashboard, analysis, report totals, and budget values display zero and the welcome guide returns.
- Cancel either confirmation and verify existing data is unchanged.
- Export a backup before restart and verify it can restore the test data afterward.