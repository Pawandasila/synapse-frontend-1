# Authentication API Integration

This document outlines the integration of authentication APIs with the Synapse frontend application.

## API Endpoints

### Authentication Endpoints
- **Signup**: `POST http://localhost:8000/api/v1/users/create`
- **Login**: `POST http://localhost:8000/api/v1/users/login`
- **Get Current User**: `GET http://localhost:8000/api/v1/users/me`

## Implementation Details

### 1. AuthContext (`src/contexts/AuthContext.tsx`)
The authentication context has been updated to integrate with the real API endpoints:

#### Features:
- **Login**: Authenticates users with email/password
- **Signup**: Creates new user accounts with role selection
- **Token Management**: Automatically stores and manages JWT tokens
- **Error Handling**: Provides detailed error messages from the API
- **Auto-login**: Checks for existing valid tokens on app initialization
- **Logout**: Clears tokens and user session

#### API Request Format:

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Signup Request:**
```json
{
  "email": "user@example.com",
  "password": "userpassword",
  "name": "User Name",
  "role": "participant" // or "organizer", "judge"
}
```

#### Expected API Response Format:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "participant",
    "avatar": "avatar_url",
    "bio": "user_bio",
    "skills": ["skill1", "skill2"],
    "university": "university_name"
  }
}
```

### 2. API Utility (`src/lib/api.ts`)
A centralized API utility provides:

#### Features:
- **Automatic token handling**: Adds Authorization headers to authenticated requests
- **Error handling**: Standardized error response parsing
- **Type safety**: TypeScript interfaces for API responses
- **Reusable functions**: Pre-built functions for common API operations

#### Usage Examples:

```typescript
import { authAPI, eventsAPI } from '@/lib/api';

// Login
const loginData = await authAPI.login(email, password);

// Get current user
const userData = await authAPI.getCurrentUser();

// Get events
const events = await eventsAPI.getAll();
```

### 3. Frontend Integration

#### Login Page (`src/app/auth/login/page.tsx`)
- Uses `useAuth()` hook for authentication
- Displays API error messages via toast notifications
- Redirects to dashboard on successful login

#### Signup Page (`src/app/auth/signup/page.tsx`)
- Role selection (participant, organizer, judge)
- Form validation including password confirmation
- Error handling with descriptive messages

## Authentication Flow

1. **User submits login/signup form**
2. **Frontend calls API endpoint**
3. **API validates credentials/creates user**
4. **API returns JWT token and user data**
5. **Frontend stores token in localStorage**
6. **User is redirected to dashboard**
7. **Token is included in subsequent API requests**

## Error Handling

The system provides comprehensive error handling:

- **Network errors**: Connection issues with the API
- **Validation errors**: Invalid input data
- **Authentication errors**: Invalid credentials
- **Authorization errors**: Expired or invalid tokens

Error messages are displayed via toast notifications and stored in the auth context state.

## Token Management

- **Storage**: JWT tokens are stored in localStorage
- **Auto-refresh**: Tokens are verified on app initialization
- **Cleanup**: Tokens are removed on logout or when invalid
- **Headers**: Automatically added to authenticated requests

## Usage in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout, error } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Environment Setup

Ensure your backend API is running on `http://localhost:8000` or update the `API_BASE_URL` in `src/lib/api.ts` to match your backend URL.

## Security Considerations

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- All API requests use HTTPS in production
- Tokens should have appropriate expiration times
- Implement refresh token mechanism for long-lived sessions
