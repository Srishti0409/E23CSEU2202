# Notification System Design Documentation
**Roll Number:** E23CSEU2202

## 1. System Architecture & Scalability (Stage 4)
To handle 10,000+ students, the system follows a decoupled Microservices architecture.

* **Database Scaling:** We use a PostgreSQL relational database. To handle high traffic, we implemented **Composite Indexing** on `(student_id, is_read)`. This ensures that fetching unread notifications for a specific student is an $O(\log N)$ operation rather than $O(N)$.
* **Asynchronous Processing:** By using a message broker (like Redis or Kafka), we ensure that the API doesn't wait for notifications to be sent. The backend places the message in a queue, and a worker process handles delivery.
* **Frontend Optimization:** The Next.js dashboard uses **Client-side Filtering** and **Pagination** to ensure that even with thousands of notifications, the browser only renders what is visible, maintaining a 60fps UI performance.

## 2. Security & Data Integrity (Stage 5)
Security is integrated at every layer of the stack:

* **Authentication:** All API requests require a **JWT (JSON Web Token)**. The proxy server validates this token before communicating with the evaluation server.
* **SQL Injection Prevention:** We use **Parameterized Queries** (Prepared Statements) in the database layer to ensure that user input can never be executed as code.
* **CORS Policy:** The backend is configured with strict **Cross-Origin Resource Sharing** rules, only allowing requests from our authorized frontend domain (localhost:3000).

## 3. Reliability & Fault Tolerance (Stage 6)
To ensure the system stays online during peak result hours:

* **Retry Mechanism:** The backend proxy implements a **3-tier retry logic** with exponential backoff. If the evaluation server fails, the proxy attempts to reconnect before returning an error to the user.
* **Load Balancing:** The system is designed to be stateless, allowing multiple instances of the backend to run behind an Nginx load balancer.
* **Graceful Degradation:** If the primary database is slow, the frontend displays cached notifications or a "System Busy" message rather than crashing, ensuring a better user experience.

