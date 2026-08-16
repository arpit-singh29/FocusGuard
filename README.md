FocusGuard

FocusGuard is a Chrome Extension designed to help users stay focused by blocking distracting websites during Focus Mode.

It provides website blocking, temporary access, focus-time tracking, streak tracking, blocked-attempt statistics, and a weekly report through a simple dashboard.

Features

* Focus Mode — Turn website blocking ON or OFF.
* Website Blocking — Blocks websites added to the blocked-sites list.
* Temporary Allow — Temporarily access a blocked website for 5 minutes.
* Blocked Attempts — Tracks how many times blocked websites were accessed.
* Focus Streak — Tracks consecutive days of Focus Mode usage.
* Total Focus Time — Tracks the total amount of time spent in Focus Mode.
* Weekly Report — Compares blocked attempts between the current week and previous week.
* Dashboard — Displays focus statistics in one place.
* Persistent Storage — Stores user data using Chrome’s local storage.
* Chrome Alarms — Handles daily streak updates and temporary-access expiration.

Tech Stack

* HTML5
* CSS3
* JavaScript
* Chrome Extensions API
* Chrome Storage API
* Chrome Alarms API

Project Structure

FocusGuard/
│
├── assets/
│   └── icons/
│
├── background/
│   └── background.js
│
├── blocked/
│   ├── blocked.html
│   ├── blocked.css
│   ├── blocked.js
│   └── blocked-page.html
│
├── dashboard/
│   ├── dashboard.html
│   ├── dashboard.css
│   └── dashboard.js
│
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
└── manifest.json

How It Works

When Focus Mode is enabled, FocusGuard monitors the websites opened in the browser.

If the opened website exists in the user’s blocked-sites list, FocusGuard redirects the user to a blocked page.

The extension also records the blocked attempt and updates the dashboard statistics.

Temporary Access

Users can temporarily allow a blocked website.

FocusGuard stores the temporary-access information and uses a Chrome alarm to restore the blocked page after the temporary access period expires.

Focus Time

When Focus Mode is enabled, the start timestamp is stored.

When Focus Mode is disabled, the elapsed time is calculated and added to the user’s total focus time.

Weekly Report

FocusGuard stores blocked-site activity using:

Date
Website
Count

This data is used to calculate the current week’s and previous week’s blocked attempts.

Installation

Since FocusGuard is currently a development Chrome Extension, it can be loaded manually using Chrome’s Developer Mode.

1. Clone the repository.

git clone <YOUR_GITHUB_REPOSITORY_URL>

2. Open Chrome.
3. Navigate to:

chrome://extensions

4. Enable Developer mode.
5. Click Load unpacked.
6. Select the FocusGuard project folder.
7. Open the extension and configure your blocked websites.

Usage

1. Open the FocusGuard extension.
2. Add websites that you want to avoid.
3. Turn Focus Mode ON.
4. Try opening a blocked website.
5. FocusGuard will display the blocked page.
6. Use the dashboard to monitor:
    * Blocked attempts
    * Focus streak
    * Total focus time
    * Weekly report

Data Storage

FocusGuard uses chrome.storage.local to store extension data such as:

* Focus Mode state
* Blocked websites
* Dashboard statistics
* Focus start time
* Temporary access information
* Weekly history

No external database is required.

Future Improvements

Planned improvements may include:

* More detailed analytics
* Charts and visual reports
* Custom blocking schedules
* Custom temporary-access duration
* Better dashboard UI
* More advanced website matching
* Chrome Web Store publication

Learning Outcomes

This project helped practice:

* DOM manipulation
* Event handling
* Browser Extension APIs
* Chrome Storage API
* Chrome Alarms API
* Asynchronous JavaScript
* Callbacks
* Local data management
* Time and date calculations
* Modular code organization
* Debugging and testing

License

This project is currently intended for learning and portfolio purposes.