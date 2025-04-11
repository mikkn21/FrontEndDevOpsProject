# DM885 Distributed Testing System - Frontend Showcase

This repository contains the frontend code developed for the "Distributed Testing System" exam project, part of the [DM885: Microservices and Dev(Sec)Ops](https://odin.sdu.dk/sitecore/index.php?a=fagbesk&id=83466&lang=en) course at the University of Southern Denmark.

**Note:** This repository contains **only the frontend** component of the original group project.

## Original Project Overview

The goal of the original project was to build a distributed system allowing teachers to set up programming assignments, students to submit solutions, and the system to automatically test these solutions within isolated Docker containers.

**Key system requirements included:**

*   **User Roles:** Students, Teachers, Administrators.
*   **Teacher Functionality:** Define assignments, provide Docker tester images, set resource limits (CPU, memory, time), manage student access, deadlines, and assignment visibility.
*   **Student Functionality:** View assignments, upload solutions, check submission status and results (logs, output).
*   **Admin Functionality:** Manage teacher and student accounts.
*   **Architecture:** Microservices backend, RESTful APIs, CI/CD pipeline, Infrastructure as Code (IaC), security best practices.
*   **Technology Stack (Group):** React/TypeScript frontend, Python/Flask backend services, Nginx gateway, PostgreSQL database, Docker, Google Cloud Platform (GKE, Cloud Logging/Monitoring, Artifact Registry), Liquibase, GitHub Actions, etc.

**For full details on the requirements, constraints, and user stories for the original project, please see the official assignment description:**

➡️ **[View the Original Project Assignment](./assets/default_project.pdf)** ⬅️


## This Repository: Frontend Implementation

This repository serves as a public showcase specifically for the **frontend application** I developed for the project. It demonstrates the user interface, user experience flows, and frontend logic built to interact with the intended backend microservices.

## Frontend Showcase Video

Here's a brief video demonstration of the frontend UI and functionality (running with mock data):

➡️ **[Watch Frontend Showcase Video](./assets/demoFrontend.mp4)** ⬅️


## My Contributions to the Original Project

While working in a group of six people, my primary responsibilities and contributions included:

*   **Frontend Development (Lead):**
    *   Led the design and implementation of the **entire React frontend application** using TypeScript and Vite.
    *   Developed all user interface components, views, and user interaction logic.
    *   Implemented client-side routing (using React Router).
    *   Handled API requests (using Axios) to the intended backend services.
    *   Managed client-side authentication state and JWT handling.
    *   Configured Nginx for serving the static React build and handling client-side routing and security headers (CSP, HSTS, etc.).
*   **Infrastructure & Cloud (Significant Involvement):**
    *   **Lead** on setting up the **logging and monitoring system** within Google Cloud Platform (GCP).
    *   **Lead** on configuring **SSL/HTTPS** for external access, including setting up the domain and managing DNS records.
    *   **Lead** on setting up **Ingress** controllers and resources within Google Kubernetes Engine (GKE) for routing external traffic.
    *   Provided **support** for other infrastructure tasks (GKE setup, CI/CD pipelines) handled primarily by my teammate [@kris098e](https://github.com/kris098e).

## Important Note: Dummy Data Usage

Due to challenges in fully integrating the frontend and backend components within the group project timeline, **this frontend code currently uses mock/dummy data.**

API calls that would normally go to the backend microservices are intercepted or replaced with static data sources within the frontend code itself. This allows the frontend's features, UI components, and user flows to be demonstrated, but **it does not communicate with a live backend system.**



----

# Frontend

Repo containing the frontend

# Build docker

**you need to have installed npm**

```bash
npm install
npm run build
docker build -t vite-frontend .
docker run -p 3000:8080 vite-frontend
```

Now access the frontend application at localhost:3000

# Local development

- **Node.js** version 14 or newer (should work)
- **npm**

## Get started

This is buildt using Vite on top of React + TS.
For Http request axios is used

Install the necessary dependencies:

```bash
npm install
```

To start the development server, run:

```bash
npm run dev
```
