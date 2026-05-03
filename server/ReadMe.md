# Task Dbuzz

A full-stack task management application with user authentication, JWT-based session handling, and role-based admin actions.

## Project structure

- `server/` - Express backend
- `client/` - React frontend

## Backend

### Setup

1. Open `server/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables in `.env` or `.envdev`.

### Required environment variables

- `MONGO_URI` - MongoDB connection string
- `PORT` - server port (default `8000`)
- `JWT_SECRET` - secret key used to sign JWTs

### Running the backend

```bash
node index.js
```

### API endpoints

- `POST /api/v1/users/register` - register a new user
- `POST /api/v1/users/login` - login existing user
- `POST /api/v1/users/logout` - logout
- `GET /api/v1/tasks` - get tasks for authenticated user
- `POST /api/v1/tasks` - create a task for authenticated user
- `PUT /api/v1/tasks/:id` - update a task (owner or admin)
- `DELETE /api/v1/tasks/:id` - delete a task (admin only)

### Validation

The backend uses Joi validation in `server/utils/validation.js` for:

- user registration
- user login
- task creation
- task update

### Authentication

- Uses JWT stored in the browser session via `sessionStorage`
- Protected routes use `authMiddleware`
- Admin-only actions are protected by `isAdmin`
- User tokens are used to enforce task ownership

## Frontend

### Setup

1. Open `client/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```

### Frontend features

- `src/pages/RegisterPage.jsx` - user registration
- `src/pages/LoginPage.jsx` - user login
- `src/pages/Dashboard.jsx` - task dashboard with CRUD operations
- `src/components/Form.jsx` - reusable login/register form
- `src/services/sessionService.js` - token/session helpers
- Uses `react-bootstrap` for UI styling

### Client routes

- `/register` - register page
- `/login` - login page
- `/dashboard` - protected task dashboard

## Notes

- The backend loads `.env` if present, otherwise `.envdev`.
- Task deletion is limited to admin users.
- Only authenticated users can access task endpoints.
- Tasks are associated with the authenticated user via `req.user.id`.
