# Performance Nutrition React App

A modern, responsive React web application for Performance Nutrition services.

## Features

- **Modern React Architecture**: Built with React 18 and functional components
- **Responsive Design**: Mobile-first design that works on all devices
- **React Router**: Client-side routing for seamless navigation
- **Component-Based Structure**: Modular and maintainable code organization
- **Professional Styling**: Clean, modern UI with CSS Grid and Flexbox

## Project Structure

```
react_app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── About.js
│   │   ├── Services.js
│   │   └── Contact.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Navigate to the react_app directory:
   ```bash
   cd react_app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Pages

- **Home**: Welcome page with hero section and service overview
- **About**: Information about the company, mission, and approach
- **Services**: Detailed list of available nutrition services
- **Contact**: Contact form and business information

## Components

- **Header**: Navigation bar with logo and menu
- **Footer**: Site footer with copyright information

## Customization

### Styling
The application uses CSS modules with a mobile-first approach. Main styles are in:
- `src/App.css` - Main application styles
- `src/index.css` - Global styles and resets

### Colors
- Primary: #3498db (Blue)
- Secondary: #2c3e50 (Dark Blue)
- Background: #f5f5f5 (Light Gray)

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route in `src/App.js`
3. Update navigation in `src/components/Header.js`

## Deployment

To build for production:
```bash
npm run build
```

This creates a `build` folder with optimized files ready for deployment.

## Technologies Used

- React 18
- React Router DOM 6
- CSS3 with Grid and Flexbox
- Create React App

## Future Enhancements

- Add state management (Redux/Context API)
- Integrate with backend API
- Add form validation library
- Implement user authentication
- Add blog/content management
- Integrate with payment processing