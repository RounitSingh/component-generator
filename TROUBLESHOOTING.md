# AI Editor Persistence Troubleshooting Guide

## Overview

This guide helps you troubleshoot issues with the AI Editor persistence system. The persistence system automatically saves and loads chat messages, AI interactions, and generated components.

## Common Issues and Solutions

### 1. Messages Not Saving

**Symptoms:**
- Messages disappear after refresh
- No persistence status indicator
- Console errors related to API calls

**Solutions:**

1. **Check Authentication:**
   ```javascript
   // In browser console
   console.log('Token:', localStorage.getItem('accessToken'));
   ```
   - If no token, log in again
   - If token exists but expired, refresh the page

2. **Check Network Connection:**
   ```javascript
   // In browser console
   console.log('Online:', navigator.onLine);
   ```
   - If offline, data will be saved locally
   - Reconnect to internet to sync with backend

3. **Check Session ID:**
   ```javascript
   // In browser console
   console.log('Session ID:', window.currentSessionId);
   ```
   - Ensure session ID is valid
   - Create a new session if needed

### 2. Components Not Loading

**Symptoms:**
- Generated components disappear after refresh
- Preview shows "No component generated yet"
- Component code is empty

**Solutions:**

1. **Check Component Store:**
   ```javascript
   // In browser console
   const componentStore = window.useComponentStore?.getState();
   console.log('Components:', componentStore?.components);
   ```

2. **Check Local Storage Backup:**
   ```javascript
   // In browser console
   const sessionId = 'your-session-id';
   const key = `ai-editor-${sessionId}-backup`;
   const backup = localStorage.getItem(key);
   console.log('Backup:', backup ? JSON.parse(backup) : null);
   ```

3. **Force Reload Session Data:**
   ```javascript
   // In browser console
   window.loadSessionData?.();
   ```

### 3. AI Responses Not Saving

**Symptoms:**
- AI responses disappear after refresh
- Interactions not recorded
- Missing conversation history

**Solutions:**

1. **Check Interaction Store:**
   ```javascript
   // In browser console
   const chatStore = window.useChatStore?.getState();
   console.log('Interactions:', chatStore?.interactions);
   ```

2. **Check API Response:**
   ```javascript
   // In browser console
   // Look for errors in Network tab
   // Check for 401, 403, or 500 errors
   ```

3. **Test API Endpoint:**
   ```javascript
   // In browser console
   fetch('/api/sessions/your-session-id/interactions', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
     }
   }).then(r => r.json()).then(console.log);
   ```

### 4. Persistence Status Issues

**Symptoms:**
- Status shows "Save failed"
- Status stuck on "Saving..."
- No status indicator

**Solutions:**

1. **Check Persistence Status:**
   ```javascript
   // In browser console
   console.log('Persistence Error:', window.persistenceError);
   console.log('Last Saved:', window.lastSaved);
   console.log('Is Online:', navigator.onLine);
   ```

2. **Reset Persistence State:**
   ```javascript
   // In browser console
   window.setPersistenceError?.(null);
   window.setLastSaved?.(Date.now());
   ```

### 5. Data Conversion Issues

**Symptoms:**
- Messages display incorrectly
- Component code malformed
- Type errors in console

**Solutions:**

1. **Test Data Conversion:**
   ```javascript
   // In browser console
   window.testPersistenceUtilities?.();
   ```

2. **Check Data Format:**
   ```javascript
   // In browser console
   const backendMessage = {
     id: 1,
     role: 'user',
     content: 'Test',
     message_type: 'text',
     metadata: {},
     created_at: new Date().toISOString()
   };
   
   const frontendMessage = window.convertBackendMessageToFrontend?.(backendMessage);
   console.log('Converted:', frontendMessage);
   ```

## Debugging Steps

### Step 1: Check Console for Errors
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Note any failed API calls

### Step 2: Check Network Tab
1. Go to Network tab in developer tools
2. Refresh the page
3. Look for failed requests (red entries)
4. Check response status codes

### Step 3: Check Local Storage
1. Go to Application tab in developer tools
2. Click on Local Storage
3. Look for session backup data
4. Check if data is corrupted

### Step 4: Run Diagnostic Tests
```javascript
// In browser console
window.testPersistence?.();
```

## API Endpoint Testing

Test each endpoint manually:

```javascript
// Test sessions endpoint
fetch('/api/sessions', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
}).then(r => r.json()).then(console.log);

// Test messages endpoint
fetch('/api/sessions/your-session-id/messages', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
}).then(r => r.json()).then(console.log);

// Test components endpoint
fetch('/api/sessions/your-session-id/components', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
}).then(r => r.json()).then(console.log);

// Test interactions endpoint
fetch('/api/sessions/your-session-id/interactions', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
}).then(r => r.json()).then(console.log);
```

## Common Error Codes

- **401 Unauthorized**: Token expired or invalid
- **403 Forbidden**: User doesn't have access to session
- **404 Not Found**: Session doesn't exist
- **500 Internal Server Error**: Backend error

## Recovery Procedures

### 1. Lost Session Data
1. Check local storage backup
2. Try to reload from backup
3. If backup is corrupted, start new session

### 2. Corrupted Data
1. Clear local storage for the session
2. Reload page
3. Data will be fetched from backend

### 3. Network Issues
1. Check internet connection
2. Data will be saved locally
3. Sync when connection restored

## Prevention Tips

1. **Regular Backups**: Data is automatically backed up to local storage
2. **Session Management**: Create new sessions for different projects
3. **Network Monitoring**: Check connection before important operations
4. **Error Monitoring**: Watch console for errors and address them promptly

## Getting Help

If you're still experiencing issues:

1. **Collect Debug Information:**
   ```javascript
   // In browser console
   const debugInfo = {
     userAgent: navigator.userAgent,
     online: navigator.onLine,
     token: !!localStorage.getItem('accessToken'),
     sessionId: window.currentSessionId,
     timestamp: new Date().toISOString()
   };
   console.log('Debug Info:', debugInfo);
   ```

2. **Check Backend Logs:**
   - Look for errors in backend console
   - Check database connection
   - Verify API endpoints are working

3. **Contact Support:**
   - Include debug information
   - Describe the exact steps to reproduce
   - Include any error messages


