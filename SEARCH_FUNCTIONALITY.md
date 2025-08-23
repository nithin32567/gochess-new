# User Search Functionality

## Overview
The search functionality allows users to search and filter users based on multiple criteria including email, tenant, role, phone number, and user names.

## Implementation Details

### Backend (Server-side)

#### Controller: `searchUsers` in `server-side/controllers/user/user.controller.js`

The search function uses MongoDB aggregation pipeline for efficient searching:

1. **Lookup Operations**: Populates related data from User, Role, and Tenant collections
2. **Tenant Filtering**: Optionally filters by tenant_id if provided
3. **Search Criteria**: Searches across multiple fields:
   - User first name (`user.fname`)
   - User last name (`user.lname`)
   - User phone number (`user.phone_number`)
   - Login email (`email`)
   - Role name (`role.name`)
   - Role description (`role.description`)
   - Tenant name (`tenant.name`)
   - Tenant subdomain (`tenant.subdomain`)
   - Combined full name (first name + last name)

4. **Case-insensitive Search**: Uses regex with "i" option for case-insensitive matching

#### Route: `server-side/routes/user/user.routes.js`

- **Endpoint**: `GET /users/search-users/:searchValue`
- **Authentication**: Requires superadmin role
- **Query Parameters**: 
  - `tenant_id` (optional): Filter by specific tenant

### Frontend (Client-side)

#### Component: `UserList.jsx` in `client-side/src/pages/superadmin/UserList.jsx`

The search input triggers the search function:

```javascript
const searchUsers = async (searchValue) => {
  // Makes API call to search endpoint
  // Handles tenant filtering
  // Updates user list with search results
};
```

#### Search Input Behavior:
- **Empty Search**: Shows all users (or filtered by tenant if selected)
- **With Search Value**: Searches across all criteria and updates results
- **Real-time Search**: Triggers on every keystroke

## Usage

1. **Basic Search**: Type any text in the search box to search across all fields
2. **Tenant Filtered Search**: Select a tenant first, then search within that tenant
3. **Combined Search**: Search works with both tenant filtering and text search

## Search Examples

- **Email Search**: `user@example.com`
- **Name Search**: `John` or `Doe` or `John Doe`
- **Phone Search**: `1234567890`
- **Role Search**: `admin` or `instructor`
- **Tenant Search**: `company` or `subdomain`

## Performance Considerations

- Uses MongoDB aggregation pipeline for efficient queries
- Indexes on frequently searched fields recommended
- Case-insensitive search with regex optimization
- Proper error handling and logging
