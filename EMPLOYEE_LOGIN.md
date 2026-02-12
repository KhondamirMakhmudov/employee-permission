# Employee Login System

## Overview

Created a beautiful employee login page similar to the manager login system with excellent UI/UX design and authentication flow.

## Features

### 1. **Employee Login Page** (`/employee-permission/login`)

- **Beautiful UI Design**:
  - Split-screen layout with emerald/teal gradient theme
  - Engaging hero section with icon and marketing copy
  - Responsive design (mobile-friendly)
  - Material Symbols icons throughout
- **Authentication Features**:
  - NextAuth integration using credentials provider
  - Session management
  - Saved login credentials (localStorage)
  - Quick login from saved accounts
  - Form validation

- **Session Management**:
  - Shows success screen when already logged in
  - User profile display with avatar
  - Quick navigation to permission form
  - Sign out functionality

### 2. **Protected Employee Permission Form** (`/employee-permission`)

- **Authentication Guard**:
  - Checks for active session
  - Shows login prompt if not authenticated
  - Beautiful authentication required screen
  - Redirects to login page

- **Enhanced Header**:
  - User profile indicator when logged in
  - Account link for quick access
  - Responsive navigation

### 3. **Updated Home Page** (`/`)

- Employee card now links to `/employee-permission/login` instead of direct form access
- Consistent navigation flow

## Authentication Flow

```
1. User visits home page (/)
   ↓
2. Clicks "Employee" card
   ↓
3. Redirected to /employee-permission/login
   ↓
4. Enters credentials and signs in
   ↓
5. Successful login → redirected to /employee-permission
   ↓
6. Can now submit permission requests
```

## API Integration

The login uses the same authentication API as the manager login:

- **Endpoint**: `${GENERAL_AUTH_URL}/auth/login`
- **Method**: POST (form-urlencoded)
- **Credentials**: username, password
- **Returns**: access_token, refresh_token
- **Provider**: NextAuth CredentialsProvider

## UI/UX Highlights

### Design Quality

✅ **Consistent Branding**: Emerald/teal color scheme for employees vs blue for managers  
✅ **Smooth Animations**: Scale, fade, bounce, and shimmer effects  
✅ **Professional Typography**: Clear hierarchy with Space Grotesk font  
✅ **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation  
✅ **Responsive**: Mobile-first design with tablet and desktop breakpoints

### User Experience

✅ **Saved Logins**: Quick access to frequently used accounts  
✅ **Loading States**: Clear feedback during authentication  
✅ **Error Handling**: Toast notifications for errors and success  
✅ **Session Persistence**: Remembers logged-in state  
✅ **Quick Navigation**: One-click access to forms and dashboards

## File Structure

```
src/pages/
├── index.js                              # Home page (updated)
├── employee-permission/
│   ├── login.js                         # New employee login page ✨
│   └── index.js                         # Protected permission form (updated)
└── manager-login/
    └── index.js                         # Existing manager login
```

## Usage

### For Employees

1. Visit the application home page
2. Click on "Сотрудник" (Employee) card
3. Enter your username and password
4. Click "Sign In"
5. After successful login, you'll be redirected to the permission request form

### Saved Logins

- Credentials are automatically saved to localStorage after first successful login
- Click "Saved Accounts" dropdown to quickly select a previously used account
- Delete saved accounts by hovering and clicking the delete icon

### Logout

- When logged in, click "Sign Out" button to end your session
- You'll be returned to the login page

## Technical Details

### Dependencies

- **next-auth**: Authentication & session management
- **react-hot-toast**: Toast notifications
- **next/router**: Navigation
- **next/image**: Optimized images

### Security Features

- Passwords are never logged to console
- Tokens stored securely in session
- HTTPS for all API calls
- Session expiration handling

## Styling

The design uses:

- **Tailwind CSS**: Utility-first styling
- **Custom Animations**: Keyframe animations for interactions
- **Material Symbols**: Icon library from Google
- **Gradient Backgrounds**: `bg-linear-to-*` classes (custom Tailwind config)

## Comparison: Employee vs Manager Login

| Feature              | Employee Login               | Manager Login                |
| -------------------- | ---------------------------- | ---------------------------- |
| **Color Theme**      | Emerald/Teal                 | Blue/Indigo/Purple           |
| **Icon**             | `badge`                      | `admin_panel_settings`       |
| **Route**            | `/employee-permission/login` | `/manager-login`             |
| **After Login**      | → `/employee-permission`     | → `/manager-login/dashboard` |
| **LocalStorage Key** | `employee_logins`            | `logins`                     |
| **User Role**        | Employee                     | Manager/Supervisor           |

## Future Enhancements

Potential improvements:

- [ ] Forgot password functionality
- [ ] Remember me checkbox (vs auto-save)
- [ ] Two-factor authentication
- [ ] Password strength indicator
- [ ] Account registration flow
- [ ] Profile photo upload
- [ ] Dark mode support
- [ ] Multi-language support

## Notes

- The login page shares the same authentication backend as manager login
- Session tokens are managed by NextAuth
- The design follows modern Material Design 3 principles
- All text is in English for employee login (vs Russian for manager login)
