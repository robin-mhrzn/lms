# Learning Management System (LMS)

This project is a scalable **Learning Management System** built using a **Microservices Architecture**. It is designed to manage courses, users, payments, and communication in an educational environment.

## 🧱 Tech Stack

### Backend (Microservices - .NET Core)
- **ASP.NET Core** API for modular services
- **RabbitMQ** for asynchronous messaging (email queuing)
- **SQL Server** for primary data storage
- **Meilisearch** for fast and relevant course search
- **Stripe** for payment integration

### Frontend
- **Admin Panel**: React.js (Ant Design, @dnd-kit/sortable)
- **Client Site**: Next.js (server-side rendering, SEO optimized, Stripe Checkout)

---

## 📁 Project Structure

```text
/lms-backend/            # .NET Core microservices
  ├── CourseService/
  ├── UserService/
  ├── PaymentService/     # Stripe integration
  ├── EmailService/
  └── Shared/

/lms-admin/              # React.js based Admin Panel

/lms-client/             # Next.js based Client Website

/infrastructure/         # RabbitMQ setup, Docker Compose, Meilisearch config
