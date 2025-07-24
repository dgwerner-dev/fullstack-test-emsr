# Coding Challenge: Event Management System with Reservations

## Project Objective

Develop a full-stack web application for users to view, create, and manage events, including a reservation system for spots. This challenge aims to evaluate your ability to handle structured data, manage inventory (spots), and integrate notifications.

## Context

Build a platform where administrators can create events (online or in-person) with a limited number of available spots. Regular users can register, view events, and reserve spots.

---

## Essential Requirements (MVP - Minimum Viable Product)

### 1. Backend (RESTful API)

* **Technologies:** Node.js (with Express.js or similar framework), TypeScript.
* **Authentication & Authorization:**
    * User registration (email, password).
    * User login (email, password).
    * Implement **JWT (JSON Web Tokens)** for authentication.
    * **Roles/Permissions:**
        * `user`: Can view events, reserve spots, and see their own reservations.
        * `admin`: Can create, edit, delete events, and manage any user's reservations.
* **User Management:** Basic CRUD (self-profile for `user`, full CRUD for `admin`).
* **Event Management:**
    * Each event must have:
        * `id` (auto-generated)
        * `name` (string, required)
        * `description` (string, optional)
        * `eventDate` (Date, required)
        * `location` (string, optional, for in-person events)
        * `onlineLink` (string, optional, for online events)
        * `maxCapacity` (number, required, > 0)
        * `availableSpots` (number, dynamically calculated, decreases with reservations, increases with cancellations)
        * `creatorId` (ID of the admin user who created the event)
    * **Endpoints:**
        * `GET /events`: List all events (filter by date, name, etc.).
        * `GET /events/:id`: Get details of a specific event.
        * `POST /events` (admin only): Create a new event.
        * `PUT /events/:id` (admin only): Update an existing event.
        * `DELETE /events/:id` (admin only): Delete an event.
* **Reservation Management:**
    * Each reservation must have:
        * `id` (auto-generated)
        * `eventId` (ID of the event)
        * `userId` (ID of the user who made the reservation)
        * `reservationDate` (Date, auto-generated)
        * `status` (enum: "confirmed", "canceled" - default "confirmed")
    * **Endpoints:**
        * `POST /events/:id/reserve` (user only): Make a reservation for an event. Must decrement `availableSpots` and fail if no spots are available.
        * `DELETE /reservations/:id` (user only, for their own reservation, or admin): Cancel a reservation. Must increment `availableSpots`.
        * `GET /my-reservations` (user only): List all reservations for the authenticated user.
        * `GET /events/:id/reservations` (admin only): List all reservations for a specific event.
* **Data Persistence:**
    * **Required:** **PostgreSQL** (or MySQL) with an ORM (e.g., Prisma, TypeORM, Sequelize).
    * **Required:** **Redis** for caching popular event information or user sessions.
* **Validation and Error Handling:** Validate input data and robust error handling.
* **Project Structure:** Logical and scalable organization.

### 2. Frontend (Web Application)

* **Technologies:** React/Next.js, TypeScript.
* **User Interface (UI):**
    * Login and Registration pages.
    * Event listing page with filters (date, name).
    * Event detail page, showing available spots and reservation option.
    * "My Reservations" page for logged-in users.
    * **Admin Panel:** If the logged-in user is an `admin`, they must have access to a panel to:
        * Create/edit/delete events.
        * View all reservations.
    * Responsive design.
* **API Consumption:** Interact with the Backend API.
* **State Management:** Utilize Context API, Redux, Zustand, or a similar library.
* **Navigation:** Use Next.js routing system.
* **User Feedback:** Clear success, error, or loading messages.

---

## Additional Requirements (Differentiators)

These points are not mandatory for MVP completion but add significant value and demonstrate a higher level of expertise.

1.  **Testing:** Implement unit and/or integration tests for backend and/or frontend.
2.  **Deployment:** Deploy the full-stack application on a cloud platform (e.g., Azure, Vercel/Netlify, Heroku). Provide links.
3.  **Real-time Notifications:**
    * Use WebSockets (e.g., Socket.io) to notify users in real-time about:
        * Spots being sold out for an event they were viewing.
        * Confirmation or cancellation of their reservation.
4.  **Calendar Integration:** Allow the user to add a reserved event to their personal calendar (Google Calendar, Outlook) via an iCal link.
5.  **Reports (Admin):** For administrators, create a simple report (in the frontend or via a new API route) showing the number of spots filled per event.
6.  **Shopify Experience (ONLY IF APPLICABLE):**
    * *Alternative to Event Management:* Create a Shopify App that allows the merchant to register "Online Consulting Sessions" with limited spots. Store customers can reserve these sessions.
        * Utilize **Shopify Polaris** for the session administration interface.
        * Sessions should be displayed on a custom page in the store via **Liquid** or script injection.
        * Manage the capacity/spots of the sessions.

---

## Project Submission

1.  **Git Repository:**
    * Create a public Git repository (GitHub, GitLab, Bitbucket).
    * Include this detailed `README.md` file.
    * Ensure the commit history is clean and reflects development progress.
2.  **Deadline:** The project must be submitted within **7 calendar days** from the receipt of this challenge.

---

## Evaluation Criteria

* **Functionality:** How well the essential requirements are met.
* **Code Quality:** Clarity, readability, modularity, code conventions, TypeScript usage.
* **Architecture and Design:** Project organization, separation of concerns, scalability.
* **Best Practices:** Error handling, data validation, security (JWT), state management.
* **Technology Usage:** Effective application of Node.js, React/Next.js, PostgreSQL/MySQL, Redis.
* **Problem Solving:** The overall approach to solving the presented challenges.
* **Documentation:** Clarity and completeness of the `README.md` file.
* **Differentiators:** Added value from implemented additional requirements.

Good luck! We look forward to seeing your solution.
