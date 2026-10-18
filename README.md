<img width="2382" height="678" alt="image" src="https://github.com/user-attachments/assets/c213cc58-f6e3-454c-83df-be9887b1dc3d" />

# **Performance Nutrition**

This README will cover the following:
+ Deployed Website
+ How To Add Authenticated Users
+ First-Time Setup (Local Development)

## 1. Deployed Website

The Performance Nutrition web application is deployed and hosted on Firebase Hosting and can be viewed using the link below.

**Website:** [https://performance-nutrition.web.app/](https://performance-nutrition.web.app/)

---

## 2. Adding Authenticated Users

After creating an account, users must be assigned the appropriate authentication role before they can access the tracking functions in Performance Nutrition.

To authenticate a newly registered user, follow these steps:

1. **Locate the authentication script**
   - Place the `setRole.js` script inside the `react_app` folder:
     ```
     Performance_Nutrition/
     └── react_app/
         └── setRole.js
     ```

2. **Obtain the user's Firebase UID**
   - Open the [Firebase Console](https://console.firebase.google.com/).
   - Select the `performance_nutrition` project.
   - Select the right arrow (>) on the bottom-left of the webpage to open the menu.
   - Navigate to **Authentication**.
   - Under the **Users** tab, locate the newly registered user.
   - Copy their **User UID** from the last column.
  
<img width="1920" height="1080" alt="3" src="https://github.com/user-attachments/assets/402ad25c-2196-4ec3-ab21-654120739828" />

<img width="1920" height="1080" alt="4" src="https://github.com/user-attachments/assets/1a2b10e4-e645-46fd-8349-aff01383513e" />

<img width="1920" height="1080" alt="5" src="https://github.com/user-attachments/assets/dd5205c7-4478-4af4-b5b1-4eafb82590d3" />

3. **Update the authentication script**
   - Open `setRole.js`.
   - Locate the `uid` const inside the `main()` function.
   - Replace its value with the user's Firebase UID.

<img width="680" height="100" alt="image" src="https://github.com/user-attachments/assets/9a5b0e58-719a-4e4e-bc55-40baecf878ad" />

4. **Run the script**
   - Open a terminal (Windows: `cmd`/`PowerShell`, Mac/Linux: `bash`/`zsh`) and navigate to the `react_app` directory.
   - Execute the script:
     ```bash
     node setRole.js
     ```

5. **Verify authentication**
   - Check the terminal output to confirm that the script executed successfully.
   - The user should now have the required role to access the tracking functions.

> **Important:** The `setRole.js` script should only be executed by authorised administrators. Ensure that any Firebase Admin SDK credentials or service account keys are kept secure and are never committed to the public repository.
>
> Assigning a custom role may require the **user to sign out and sign back in** to refresh their Firebase authentication token.

---

## 3. First-Time Setup (Local Development)

If you would like to make changes to the repository on your own computer, follow the instructions below to set up the development environment.

### Step 1: Install Prerequisites

Ensure that the following tools are installed:

| Tool | Purpose | Installation |
|------|---------|--------------|
| **Node.js** | JavaScript runtime required to run the application | [Download Node.js](https://nodejs.org/) |
| **npm** | Package manager for installing project dependencies (included with Node.js) | Installed alongside Node.js |
| **Git** | Version control system for cloning and managing the repository | [Download Git](https://git-scm.com/) |
| **Firebase CLI** | Command-line tool for managing and deploying Firebase services. **Install it using a terminal** on the project's root folder. | `npm install -g firebase-tools` |
| **Supabase CLI** | Command-line tool for managing Supabase services, if needed. **Install it using a terminal** on the project's root folder. | `npm install -g supabase` |

> **Note:** JavaScript does not need to be installed separately, as Node.js provides the required runtime. Firebase CLI and Supabase CLI are optional for basic frontend development but may be necessary when working with their respective backend services.

To verify that Node.js, npm, and Git are installed correctly, run:

```bash
node --version
npm --version
git --version
```

### Step 2: Clone the Repository

Open a terminal (Windows: `cmd`/`PowerShell`, Mac/Linux: `bash`/`zsh`) and clone the repository onto your local machine:

```bash
git clone https://github.com/ChowchowWorks/Performance_Nutrition.git
```

Navigate into the cloned repository:

```bash
cd Performance_Nutrition
```

### Step 3: Install Project Dependencies

Navigate to the `react_app` directory:

```bash
cd react_app
```

Install the required dependencies:

```bash
npm install
```

If necessary, you can check for outdated packages using:

```bash
npm outdated
```

> **Note:** Run `npm install` in the directory containing the relevant `package.json` file. Avoid running `npm update` unnecessarily, as this may update dependencies and introduce compatibility issues.

### Step 4: Configure Environment Variables

Inside the `react_app` directory, insert the `.env` file containing the environment variables required for the application.

The directory structure should resemble:

```
Performance_Nutrition/
└── react_app/
    ├── src/
    ├── public/
    ├── package.json
    ├── .env
    └── ...
└── chatbot_actual
└── node_modules
└── ...
```

Ensure that the `.env` file contains the necessary Firebase, Supabase, and other application configuration variables.

> **Important:** Do not commit the `.env` file to GitHub if it contains secrets or private credentials. Ensure that `.env` is included in `.gitignore`. Frontend-exposed environment variables must never contain private server-side API keys.

### Step 5: Make Your Changes

Once the dependencies and environment variables are configured, you can begin modifying the application's source code.

Most frontend changes will be made within:

```
react_app/src/
```

Use your preferred code editor, such as Visual Studio Code, to edit the project files.

### Step 6: Run the Application Locally

From the `react_app` directory, start the development server:

```bash
npm run dev
```

The terminal should display a local development URL, typically:

```
http://localhost:5173/
```

Open the displayed URL in your browser to view the application.

Changes made to the source code should automatically appear in the browser through the development server's hot-reloading functionality.

### Step 7: Debugging and Troubleshooting

If you encounter bugs or unexpected behaviour, you can investigate errors using the following methods.

**Method 1: Check the Terminal**

Inspect the terminal running `npm run dev` for:
- Compilation errors
- Missing dependencies
- Invalid imports
- Development server errors

**Method 2: Use Browser Developer Tools**

Open your browser's Developer Tools using:

- **Windows/Linux:** `F12` or `Ctrl + Shift + I`
- **macOS:** `Cmd + Option + I`

Navigate to the **Console** tab to inspect JavaScript errors, warnings, and debugging messages.

You can also use the **Network** tab to investigate failed requests to Firebase, Supabase, or other backend services.

**Method 3: Restart the Development Server**

If changes are not reflected or the application behaves unexpectedly:

1. Stop the development server using `Ctrl + C`.
2. Restart it by running:

   ```bash
   npm run dev
   ```

---

## Additional Notes

- Always ensure that the correct Firebase and Supabase projects are configured before running or deploying the application.
- **Do not commit sensitive credentials, service account keys, or private environment files to the repository.**
- When installing new dependencies, ensure that changes to `package.json` and `package-lock.json` are tracked appropriately.
- Before deploying changes, test the application locally to verify that all major functions are working correctly.
