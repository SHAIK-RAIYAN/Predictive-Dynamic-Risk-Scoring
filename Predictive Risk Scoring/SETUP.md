# Risk Scoring Platform Setup Guide

## Overview
This guide will help you set up authentication with Clerk and real-time data storage with Firebase for the Risk Scoring Platform.

## 🔐 Clerk Authentication Setup

### 1. Create a Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application
3. Choose your authentication methods (Email, Google, GitHub, etc.)

### 2. Configure OAuth Providers

#### Google OAuth:
1. In your Clerk dashboard, go to "User & Authentication" → "Social Connections"
2. Enable Google
3. Add your Google OAuth credentials from Google Cloud Console

#### GitHub OAuth:
1. In your Clerk dashboard, enable GitHub
2. Add your GitHub OAuth App credentials

### 3. Get Your Clerk Keys
1. In your Clerk dashboard, go to "API Keys"
2. Copy your **Publishable Key**

### 4. Environment Variables
Create a `.env.local` file in your project root:

```bash
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_publishable_key_here
```

## 🔥 Firebase Setup

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Follow the setup wizard

### 2. Enable Services

#### Firestore Database:
1. In your Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

#### Authentication (Optional):
1. Go to "Authentication" → "Sign-in method"
2. This is handled by Clerk, but you can enable it for backup

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register your app and copy the config object

### 4. Add Firebase Environment Variables
Add these to your `.env.local` file:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=1:your_app_id_here:web:your_web_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID
```

## 🚀 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## 📊 Features Added

### ✅ Colorful Charts
- **Line Chart**: Blue gradient with interactive dots
- **Pie Chart**: Red (high risk), Orange (medium), Green (low risk)
- **Risk Indicators**: Color-coded chips and progress bars

### ✅ Authentication
- **Clerk Integration**: Google and GitHub OAuth
- **Protected Routes**: All pages require authentication
- **User Profile**: Integrated user management
- **Logout**: Secure sign-out functionality

### ✅ Real-time Features
- **Live Monitoring Toggle**: Start/stop real-time data updates
- **Firebase Integration**: Real-time data storage and retrieval
- **Status Indicators**: Visual feedback for connection status

### ✅ Enhanced UI
- **Risk Chips**: Color-coded with hover effects
- **Animated Components**: Smooth transitions and interactions
- **Responsive Design**: Works on all screen sizes
- **Dark/Light Mode**: Theme toggle with persistence

## 🔧 Configuration Notes

### Clerk Settings
- The app is configured to redirect to `/dashboard` after sign-in
- Sign-out redirects to the home page
- User profile is available through the user button in the header

### Firebase Collections
The app uses these Firestore collections:
- `risk_assessments`: User risk assessments
- `entities`: Monitored entities and their risk scores
- `risk_events`: Real-time risk events
- `users`: User profiles and preferences
- `notifications`: System notifications

### Live Monitoring
- Click the "Live Monitoring" chip in the header to toggle real-time updates
- When active, the system will listen for changes in Firebase
- Status indicator in the sidebar shows connection status

## 🎨 Color Scheme

### Risk Levels
- **Critical/High**: Red (#ef4444)
- **Medium**: Orange (#f59e0b)
- **Low**: Green (#10b981)

### Charts
- **Line Chart**: Blue (#3b82f6)
- **Pie Chart**: Risk-level colors
- **Progress Bars**: Matching risk colors

## 🐛 Troubleshooting

### Common Issues

1. **Clerk not loading**: Check your publishable key in `.env.local`
2. **Firebase errors**: Verify your project configuration
3. **Authentication redirect loops**: Clear browser cache and cookies
4. **Real-time not working**: Check Firebase security rules

### Security Rules (Firebase)
For development, you can use these Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure Clerk and Firebase projects are properly configured
4. Check that OAuth providers are enabled in Clerk

## 🎯 Next Steps

1. Set up your Clerk and Firebase accounts
2. Add the environment variables
3. Test authentication flow
4. Customize the risk assessment logic
5. Add more real-time features as needed
