# 🕶️ IMF Gadget API - Postman Documentation

This folder contains the complete Postman collection and environment for the IMF Gadget API.

## 📁 Files Included

- `IMF-Gadget-API.postman_collection.json` - Complete API collection with all endpoints
- `IMF-Gadget-API.postman_environment.json` - Environment variables for the API
- `README.md` - This documentation file

## 🚀 How to Import into Postman

### Method 1: Import Collection File

1. **Open Postman**
2. **Click "Import"** (top left corner)
3. **Upload Files** tab
4. **Select both JSON files**:
   - `IMF-Gadget-API.postman_collection.json`
   - `IMF-Gadget-API.postman_environment.json`
5. **Click "Import"**

### Method 2: Import via URL (if hosted)

1. **Open Postman**
2. **Click "Import"**
3. **Link** tab
4. **Paste the URL** to the collection file
5. **Click "Continue"** → **Import**

## ⚙️ Setup Instructions

### 1. Configure Environment

After importing, you need to update the environment variables:

1. **Select Environment**: Click the environment dropdown (top right) and select "IMF API Environment"
2. **Edit Environment**: Click the eye icon → "Edit"
3. **Update Variables**:
   - `base_url`: Replace with your actual Render deployment URL
   - `token`: Leave empty (will be auto-populated after login)
   - `gadget_id`: Use for testing specific gadget operations

### 2. Test the Setup

1. **Run Health Check**: Start with the "API Health Status" request to verify connectivity
2. **Login**: Use the "Login Agent" request with test credentials
3. **Verify Token**: Check that the token was automatically saved to environment variables

## 🎭 Test Credentials

Use these pre-seeded test accounts:

```
Admin User:
- Email: admin@imf.gov
- Password: admin123456
- Permissions: Full access

Handler User:
- Email: handler@imf.gov
- Password: handler123456
- Permissions: Manage gadgets, trigger self-destruct

Agent User:
- Email: agent@imf.gov
- Password: agent123456
- Permissions: View gadgets only
```

## 📚 Collection Structure

### 🔐 Authentication
- **Register Agent**: Create new IMF agents
- **Login Agent**: Authenticate and receive JWT token

### 🔧 Gadget Management
- **Get All Gadgets**: Retrieve complete inventory
- **Get Gadgets by Status**: Filter by status (AVAILABLE, DEPLOYED, etc.)
- **Get Specific Gadget**: Retrieve individual gadget details
- **Create New Gadget**: Add gadgets to inventory (HANDLER/ADMIN only)
- **Update Gadget**: Modify existing gadgets (HANDLER/ADMIN only)
- **Decommission Gadget**: Soft delete gadgets (HANDLER/ADMIN only)

### 💥 Self-Destruct Operations
- **Trigger Self-Destruct**: Activate gadget self-destruct sequence (HANDLER/ADMIN only)

### 🏥 Health Check
- **API Health Status**: Check API operational status

## 🔧 Advanced Features

### Automatic Token Management

The collection includes scripts that automatically:
- Save JWT tokens to environment variables after login
- Include tokens in Authorization headers for protected endpoints
- Validate successful responses

### Pre-request Scripts

Some requests include pre-request scripts for:
- Dynamic variable generation
- Request validation
- Environment setup

### Test Scripts

Post-request test scripts verify:
- Response status codes
- Response structure
- Token extraction and storage
- Data validation

## 🛡️ Security Notes

- **Never commit tokens**: The environment file has empty token values by default
- **Use HTTPS**: Always use secure connections for API calls
- **Rotate credentials**: Regularly update test account passwords
- **Environment isolation**: Use separate environments for development/production

## 🔍 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Ensure you've logged in and token is saved
   - Check token expiration (24 hours by default)
   - Verify correct Authorization header format

2. **403 Forbidden**
   - Check user role permissions
   - Ensure you're using the correct test account for the operation

3. **404 Not Found**
   - Verify the base_url is correct
   - Check that your Render deployment is active
   - Ensure gadget_id exists for specific gadget operations

4. **Connection Errors**
   - Verify your Render app is deployed and running
   - Check the deployment URL is correct
   - Ensure your internet connection is stable

### Getting Help

If you encounter issues:
1. Check the Render deployment logs
2. Verify environment variables are set correctly
3. Test with the health check endpoint first
4. Review the API documentation in the collection descriptions

## 📖 API Documentation

Each request in the collection includes:
- **Detailed descriptions** of functionality
- **Request/response examples** with sample data
- **Authorization requirements** and role permissions
- **Parameter documentation** with validation rules
- **Error handling** information

## 🚀 Next Steps

1. **Import the collection** into Postman
2. **Update environment variables** with your deployment URL
3. **Test authentication** with provided credentials
4. **Explore all endpoints** using the organized folder structure
5. **Create your own requests** based on the examples provided

---

*This message will self-destruct in 5 seconds... 💥*