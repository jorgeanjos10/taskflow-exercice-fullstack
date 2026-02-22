\# TaskFlow – Fullstack Exercise



TaskFlow is a fullstack application developed as part of a technical exercise.



The system allows managing employees and vacation requests with role-based behavior and approval workflows.



---



\# 🚀 Tech Stack



\## Backend

\- Java 17

\- Spring Boot

\- Spring Data JPA

\- PostgreSQL

\- Maven



\## Frontend

\- Next.js (App Router)

\- TypeScript

\- Material UI (MUI)

\- Day.js



\## Database

\- PostgreSQL



---



\# 🧠 Main Features



\## Employees

\- Create, update and delete employees (Admin only)

\- Assign managers to collaborators

\- Role-based logic (ADMIN / MANAGER / COLLABORATOR)

\- Employee detail page

\- Client-side pagination

\- Dynamic breadcrumbs



\## Vacations

\- Request vacation (Collaborator)

\- Approve / Reject vacation (Manager / Admin)

\- Prevent overlapping vacation requests

\- Prevent invalid date ranges (start date after end date)

\- Prevent past date selection (frontend validation)

\- Status indicators (Approved / Rejected / Pending)

\- Client-side pagination

\- Snackbar feedback on actions



---



\# 📂 Project Structure



```

taskflow-exercise-fullstack

&nbsp;├── taskflow-backend

&nbsp;├── taskflow-frontend

&nbsp;├── README.md

&nbsp;└── Enunciado Exercicio - Full Stack.pdf

```



---



\# ⚙️ How to Run the Project



Follow these steps to run the application locally.



---



\## 1️⃣ Clone the Repository



```bash

git clone https://github.com/YOUR\_USERNAME/taskflow-exercise-fullstack.git

cd taskflow-exercise-fullstack

```



Replace `YOUR\_USERNAME` with your GitHub username.



---



\## 2️⃣ Setup PostgreSQL Database



Make sure PostgreSQL is installed and running.



Create the database:



```sql

CREATE DATABASE taskflow;

```



---



\### Configure Backend Database Connection



Open:



```

taskflow-backend/src/main/resources/application.yml

```



Example configuration:



```yaml

spring:

&nbsp; datasource:

&nbsp;   url: jdbc:postgresql://localhost:5432/taskflow

&nbsp;   username: postgres

&nbsp;   password: postgres

&nbsp; jpa:

&nbsp;   hibernate:

&nbsp;     ddl-auto: update

&nbsp;   show-sql: true

```



Adjust username and password according to your local PostgreSQL configuration.



Hibernate will automatically create/update the database schema.



---



\### 🐳 Optional – Run PostgreSQL with Docker



You can run PostgreSQL using Docker:



```bash

docker run --name taskflow-db \\

&nbsp; -e POSTGRES\_DB=taskflow \\

&nbsp; -e POSTGRES\_USER=postgres \\

&nbsp; -e POSTGRES\_PASSWORD=postgres \\

&nbsp; -p 5432:5432 \\

&nbsp; -d postgres

```



---



\## 3️⃣ Run Backend



```bash

cd taskflow-backend

./mvnw spring-boot:run

-
or
-

1-open with a java running app like Eclipse
2-import -> existing maven project -> taskflow-backend




Backend will run at:



```

http://localhost:8080

```



Swagger UI:



```

http://localhost:8080/swagger-ui/index.html

```



---



\## 4️⃣ Run Frontend



```bash

cd taskflow-frontend

npm install

npm run dev

```



Frontend will run at:



```

http://localhost:3000

```



---



\# 🔐 Authentication Approach



This project does not implement real authentication (JWT).



Instead, it simulates logged-in users using a custom HTTP header:



```

X-USER-ID

```



The selected employee acts as the current user.



This approach was intentionally chosen to focus on:



\- Business logic

\- Role-based permissions

\- Vacation approval workflow

\- Backend validation



---



\# 🏗 Design Decisions



\- Employees act as system users.

\- Role-based behavior enforced in both backend and frontend.

\- Vacation approval logic implemented in the service layer.

\- Overlapping date validation implemented server-side.

\- Client-side pagination used for simplicity.

\- Architecture allows easy migration to backend pagination using Spring `Pageable`.

\- Dynamic breadcrumb navigation implemented in layout.

\- UI feedback implemented using Material UI Snackbar.



---



\# 📌 Notes



\- Database schema is managed automatically via Hibernate.

\- Client-side pagination was chosen due to small dataset size.

\- Project is structured with clear separation between backend and frontend.



---



\# 👤 Author



Developed by JORGE CORREIA ANJOS

