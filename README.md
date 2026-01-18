Productivity Management Dashboard API

A backend REST API for managing tasks, tracking productivity, and visualizing user performance.  
---
Features

Authentication & Authorization
- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Protected routes using middleware

Task Management
- Create, read, update, and delete tasks
- Tasks are user-specific (ownership enforced)
- Task fields:
  - Title
  - Description
  - Priority (Low, Medium, High)
  - Status (Pending, In Progress, Completed)
  - Deadline
  - Tags
- Automatic overdue detection

Search & Filtering
- Filter tasks by:
  - Status
  - Priority
  - Deadline range
  - Tags

Productivity Dashboard
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks
- Completion rate (%)
---
Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB (local)
- **Authentication:** JWT
- **ODM:** Mongoose
---
