# Email Setup Guide

## Overview
This guide explains how to properly configure email functionality in the GoChess LMS application.

## Security Issues Fixed

### 1. **Password Reset Implementation**
- **Before**: Sending plain text passwords via email (security risk)
- **After**: Using secure JWT tokens with expiration for password reset links

### 2. **Email Credentials**
- **Before**: Hardcoded credentials in code
- **After**: Using environment variables for secure credential management

### 3. **Error Handling**
- **Before**: No proper error handling for email failures
- **After**: Comprehensive error handling with graceful fallbacks

## Environment Variables Setup

Create a `.env` file in the `server-side` directory with the following variables:

```env
# Email Configuration
USER_EMAIL=your_email@gmail.com
GOOGLE_APP_PASSWORD=your_google_app_password_here

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

## Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `GOOGLE_APP_PASSWORD`

## API Endpoints

### Password Reset Flow

1. **Request Password Reset**
   ```
   POST /api/users/requestpasswordreset
   Body: { "email": "user@example.com" }
   ```
   - Generates secure JWT token
   - Sends email with reset link
   - Token expires in 1 hour

2. **Reset Password**
   ```
   POST /api/users/resetpassword
   Body: { 
     "token": "jwt_token_from_email",
     "newPassword": "new_secure_password"
   }
   ```
   - Verifies token validity
   - Updates password securely
   - Clears reset token

### Tenant Creation
- Sends welcome email with temporary credentials
- Includes security warnings about password change
- Professional HTML email template

## Email Templates

### Password Reset Email
- Professional HTML design
- Clear call-to-action button
- Security warnings
- Fallback text link

### Welcome Email
- Branded GoChess LMS design
- Temporary credentials display
- Security notice section
- Clear instructions

## Security Best Practices

1. **Never send passwords in plain text**
2. **Use environment variables for credentials**
3. **Implement token expiration**
4. **Add proper error handling**
5. **Use HTTPS for production**
6. **Rate limit password reset requests**

## Testing

To test email functionality:

1. Set up environment variables
2. Create a test user
3. Request password reset
4. Check email delivery
5. Test reset link functionality

## Troubleshooting

### Common Issues:
- **Email not sending**: Check Gmail app password
- **Token expired**: Request new reset link
- **Invalid token**: Ensure proper JWT secret
- **Frontend URL**: Verify `FRONTEND_URL` environment variable

### Debug Mode:
Enable debug logging by setting `NODE_ENV=development` in your environment variables. 