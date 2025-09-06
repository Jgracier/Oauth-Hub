# Authentication Issue: Users Being "Kicked Out" Immediately

## 🐛 **Issue Description**

**Symptom**: Users report being "kicked out immediately" after logging in. They can log in successfully but are redirected back to the login page when trying to access protected pages like the dashboard.

**User Experience**: 
- Login appears to work (returns success response)
- Redirect to dashboard happens
- But then immediately redirected back to login page
- User never stays logged in

## 🔍 **Root Cause Analysis**

The issue was caused by a **mismatch between client-side and server-side authentication mechanisms**:

### **Server-Side (Working Correctly)**
- Uses **session cookies** for authentication
- Login endpoint sets `Set-Cookie` header with session token
- Session validation via `/check-session` endpoint works properly
- Session data stored in Cloudflare KV with TTL

### **Client-Side (Broken)**
- Used **localStorage** to check authentication status
- When localStorage was empty (page refresh, new tab, etc.), client-side script would redirect to login
- This happened even when server-side session was still valid

### **The Mismatch**
```javascript
// BROKEN: Client-side auth check (old code)
const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
  window.location.href = '/auth'; // Redirect even if session is valid!
}
```

## ⚙️ **Technical Details**

### **Authentication Flow Issues**

1. **Login Process**:
   - ✅ Server creates session and sets cookie
   - ✅ Client stores user data in localStorage  
   - ✅ Redirect to dashboard works

2. **Page Refresh/New Tab**:
   - ❌ localStorage might be empty
   - ✅ Session cookie still valid
   - ❌ Client-side script redirects to login (wrong!)

3. **CORS Cookie Issues**:
   - JavaScript `fetch()` requests don't include cookies by default
   - Missing `credentials: 'include'` in fetch requests
   - Missing `Access-Control-Allow-Credentials: true` in CORS headers

## 🔧 **The Fix**

### **1. Updated Client-Side Authentication Check**

**File**: `src/lib/auth/client-auth.js`

**Before (Broken)**:
```javascript
export function getClientAuthScript() {
  return `
    <script>
      (function() {
        // Check localStorage only - WRONG!
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        const apiKey = localStorage.getItem('defaultApiKey') || localStorage.getItem('apiKey');
        
        // Redirect if localStorage is empty, even if session is valid
        if ((!userEmail || !userName || !apiKey) && 
            window.location.pathname !== '/auth' && 
            window.location.pathname !== '/') {
          window.location.href = '/auth';
          return;
        }
        
        // Display user info if available
        const userEmailElement = document.getElementById('user-email');
        if (userEmailElement && userEmail) {
          userEmailElement.textContent = userEmail;
        }
      })();
    </script>
  `;
}
```

**After (Fixed)**:
```javascript
export function getClientAuthScript() {
  return `
    <script>
      (async function() {
        // Check server session instead of localStorage - CORRECT!
        try {
          const response = await fetch('/check-session', {
            method: 'GET',
            credentials: 'include' // Include session cookie
          });
          
          if (response.ok) {
            const sessionData = await response.json();
            
            if (sessionData.authenticated) {
              // User is authenticated, update localStorage and display info
              localStorage.setItem('userEmail', sessionData.user.email);
              localStorage.setItem('userName', sessionData.user.name);
              
              // Display user info
              const userEmailElement = document.getElementById('user-email');
              if (userEmailElement) {
                userEmailElement.textContent = sessionData.user.email;
              }
              return; // Stay on current page
            }
          }
          
          // Not authenticated - redirect to auth page if not already there
          if (window.location.pathname !== '/auth' && 
              window.location.pathname !== '/') {
            window.location.href = '/auth';
            return;
          }
          
        } catch (error) {
          console.error('Session check failed:', error);
          // On error, redirect to auth page if not already there
          if (window.location.pathname !== '/auth' && 
              window.location.pathname !== '/') {
            window.location.href = '/auth';
          }
        }
      })();
    </script>
  `;
}
```

### **2. Fixed CORS Headers for Credentials**

**File**: `src/lib/utils/helpers.js`

**Before**:
```javascript
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // Can't use '*' with credentials
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}
```

**After**:
```javascript
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://oauth-hub.com', // Specific origin required
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true', // Allow cookies
    'Access-Control-Max-Age': '86400',
  };
}
```

### **3. Added Credentials to Login Request**

**File**: `src/ui/pages/auth.js`

**Before**:
```javascript
const response = await fetch('/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

**After**:
```javascript
const response = await fetch('/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include', // Include cookies in request
  body: JSON.stringify(data)
});
```

## ✅ **Verification Steps**

To verify the fix is working:

1. **Fresh Login Test**:
   - Login with valid credentials
   - Should redirect to dashboard and stay there

2. **Page Refresh Test**:
   - Login successfully
   - Refresh the dashboard page
   - Should stay on dashboard (not redirect to login)

3. **Direct URL Access Test**:
   - Login successfully
   - Open new tab and go directly to `/dashboard`
   - Should load dashboard (not redirect to login)

4. **Invalid Session Test**:
   - Logout completely
   - Try to access `/dashboard` directly
   - Should redirect to login page after ~2 seconds

5. **Session Expiry Test**:
   - Wait for session to expire (24 hours by default)
   - Try to access protected pages
   - Should redirect to login

## 🚨 **How to Diagnose This Issue**

If users report being "kicked out immediately", check these:

### **1. Browser Developer Tools**
```javascript
// In browser console, check localStorage
console.log({
  userEmail: localStorage.getItem('userEmail'),
  userName: localStorage.getItem('userName'),
  apiKey: localStorage.getItem('defaultApiKey')
});

// Check session validation
fetch('/check-session', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log);
```

### **2. Network Tab**
- Look for `/check-session` requests
- Verify `credentials: 'include'` is being sent
- Check for `Set-Cookie` headers in login response
- Verify cookies are being sent in subsequent requests

### **3. Server Logs**
- Check for session validation errors
- Look for CORS-related errors
- Verify session tokens are being created and stored

### **4. Quick Test Commands**
```bash
# Test login endpoint
curl -X POST https://oauth-hub.com/auth \
  -H "Content-Type: application/json" \
  -d '{"mode":"login","email":"test@example.com","password":"password"}' \
  -c cookies.txt -v

# Test session check with cookies
curl -X GET https://oauth-hub.com/check-session \
  -b cookies.txt -v
```

## 🔄 **Prevention**

To prevent this issue from recurring:

1. **Always use server-side session validation** as the source of truth
2. **Use localStorage only for UI optimization**, not authentication decisions
3. **Include `credentials: 'include'`** in all authenticated requests
4. **Set proper CORS headers** when using credentials
5. **Test authentication flow** with page refreshes and direct URL access

## 📝 **Related Files**

- `src/lib/auth/client-auth.js` - Client-side authentication logic
- `src/lib/utils/helpers.js` - CORS headers configuration
- `src/ui/pages/auth.js` - Login form handling
- `src/api/handlers/auth.handler.js` - Server-side authentication
- `src/core/router.js` - Session validation endpoint

## 🏷️ **Tags**

`authentication` `session-management` `cors` `cookies` `localStorage` `client-server-mismatch`
