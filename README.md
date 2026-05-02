# ProjectHub 🚀

A beautiful React project management dashboard for your Spring Boot backend.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Make sure your Spring Boot backend is running:**
   ```
   http://localhost:8080
   ```

3. **Start the app:**
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000`

---

## Features

- 🔐 **Auth** — Register & Login with JWT
- 🏠 **Dashboard** — Pie chart + Bar chart + project progress bars
- 📁 **Projects** — Create, delete, add members
- 📋 **Tasks** — Create, edit (with status), delete tasks per project
- 👤 **My Tasks** — View tasks assigned to you

---

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/projects` | All projects |
| POST | `/api/projects` | Create project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/members` | Add member |
| GET | `/api/tasks/projects/:id` | Tasks in project |
| POST | `/api/tasks/projects/:id` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/assigned-to-me` | My tasks |
| GET | `/api/tasks/projects/:id/stats` | Project stats |

---

## CORS Setup (Spring Boot)

Add this to your Spring Boot app to allow the React frontend:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
            .allowedHeaders("*");
    }
}
```
