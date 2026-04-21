# Test Upload - Debug Guide

## Step 1: Check if You're Logged In

Open browser console (Press F12) and run:

```javascript
console.log('Auth Token:', localStorage.getItem('authToken'));
console.log('User Email:', localStorage.getItem('userEmail'));
console.log('User Name:', localStorage.getItem('userName'));
```

**Expected Result:**
- If logged in: You'll see a token string
- If NOT logged in: You'll see `null`

**If you see `null`:**
→ You need to login first! Go to http://localhost:3000/login

## Step 2: Check Backend is Running

Open browser and visit:
```
http://localhost:8000/api/health/
```

**Expected Result:**
```json
{
  "status": "ok",
  "message": "Document Tracking API is running"
}
```

**If you see error:**
→ Backend is not running. Start it:
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

## Step 3: Test Upload Endpoint

Open browser console and run this test:

```javascript
// Test upload endpoint
async function testUpload() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('❌ Not logged in! Please login first.');
    return;
  }
  
  console.log('✅ Token found:', token.substring(0, 20) + '...');
  
  // Test with a simple text file
  const blob = new Blob(['Hello World'], { type: 'text/plain' });
  const file = new File([blob], 'test.txt', { type: 'text/plain' });
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', 'Test Document');
  formData.append('status', 'Pending');
  
  try {
    const response = await fetch('http://localhost:8000/api/documents/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Upload successful!');
    } else {
      console.error('❌ Upload failed:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

testUpload();
```

## Common Issues & Solutions

### Issue 1: Not Logged In
**Error:** "You must be logged in to upload documents"
**Solution:**
1. Go to http://localhost:3000/login
2. Login or create account
3. Try upload again

### Issue 2: Backend Not Running
**Error:** "Cannot connect to server"
**Solution:**
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Issue 3: Authentication Failed
**Error:** "Authentication failed. Please login again"
**Solution:**
1. Logout
2. Login again
3. Try upload

### Issue 4: Invalid Token
**Error:** "401 Unauthorized"
**Solution:**
- Token might be expired
- Login again to get new token

### Issue 5: Database Not Set Up
**Error:** Backend crashes
**Solution:**
```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

### Issue 6: CORS Error
**Error:** "CORS policy blocked"
**Solution:**
Check `backend/document_tracking/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]
```

## Full Test Procedure

### 1. Start Backend
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Login
- Go to http://localhost:3000/login
- Login with your credentials
- Or create new account at http://localhost:3000/signup

### 4. Test Upload
- Click "Upload" in sidebar
- Select a file
- Fill in details
- Click "Upload Document"

### 5. Check Browser Console
- Press F12
- Look for console messages
- Check for errors

### 6. Check Backend Terminal
- Look for POST request
- Check for errors
- Should see: "POST /api/documents/ 201"

## Debug Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Logged in (has auth token)
- [ ] Database migrated
- [ ] No CORS errors
- [ ] File size under 10MB
- [ ] File type is supported

## Get Detailed Error Info

Add this to browser console to see full error:

```javascript
// Enable detailed logging
localStorage.setItem('debug', 'true');

// Then try upload again and check console
```

## Manual Upload Test (curl)

Test upload from command line:

```bash
# First login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your@email.com\",\"password\":\"yourpassword\"}"

# Copy the token from response

# Then upload
curl -X POST http://localhost:8000/api/documents/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@C:\path\to\file.pdf" \
  -F "name=Test Document" \
  -F "status=Pending"
```

## Success Indicators

When upload works:
- ✅ Console shows: "Response status: 201"
- ✅ Modal shows: "Document uploaded successfully!"
- ✅ Document appears in list
- ✅ Backend shows: "POST /api/documents/ 201"

## Still Not Working?

1. **Clear browser cache** - Ctrl+Shift+Delete
2. **Restart both servers**
3. **Check all terminals for errors**
4. **Try different browser**
5. **Check firewall settings**

## Contact Info

If still having issues, provide:
1. Browser console errors (F12)
2. Backend terminal output
3. Response status code
4. Response data
