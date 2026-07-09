# Artisanal Bakery ERP

Welcome to the **Artisanal Bakery** repository. This is a portfolio project designed to demonstrate the seamless integration of an immersive user interface with a robust and secure backend infrastructure.

The core objective was not merely to develop a visually appealing landing page, but to architect a complete, functional system. The application serves a dual purpose: operating as an interactive storefront for end-users and as a comprehensive Enterprise Resource Planning (ERP) dashboard for inventory management, order tracking, and recipe cost calculation.

---

## Project Concept and Architecture

The project was developed to solve two main business requirements:

1. **Customer Experience (Frontend):** Deliver an interface that conveys the welcoming, artisanal feel of a local bakery. This is achieved through fluid animations and interactive visual details, such as subtle particle effects and scroll-driven page transitions.
2. **Business Management (Admin Dashboard):** Develop a fast and efficient administration system capable of managing product catalogs, processing orders, and cross-referencing raw ingredient costs against retail prices to calculate real-time profit margins.

---

## Technical Highlights and Features

The architecture was designed with modern standards, focusing on security, performance, and maintainability:

### The Storefront (UI/UX)
- **Sensory Design:** Utilization of GSAP and Framer Motion to animate menus and transitions. The digital menu features interactions that simulate the handling of physical pages.
- **Optimistic Cart Updates:** The shopping cart is rendered as a side drawer that updates optimistically without requiring page reloads, consistently validating against real-time stock limits.
- **Performance and Accessibility:** Complex animations are automatically paused if the browser tab loses focus to optimize battery consumption. The project fully respects the `prefers-reduced-motion` media query for users who prefer static navigation.

### Security and Integrity
- **Fraud-Proof Checkout:** During payment processing, the server does not trust price values sent by the client. The system intercepts the product IDs and natively recalculates the entire subtotal querying the database directly, preventing any client-side price manipulation.
- **Server Action Protection:** All mutation actions (such as product deletion or configuration edits) strictly validate active administrator sessions. Unauthorized attempts to access protected routes or execute mutations are immediately blocked and logged.

### Observability and Monitoring
The application was built with a production-ready mindset, focusing on diagnostic capabilities:
- **Structured Logging:** Standard `console.log` usage was replaced by a structured JSON Logger. In the event of a critical failure, the server logs the error in a standardized format containing timestamps and full stack traces, optimized for ingestion by monitoring tools.
- **Database Auditing:** The Prisma ORM is configured to log execution times and query structures, facilitating the identification of performance bottlenecks within the deployment environment.
- **Health Check Endpoint:** A dedicated `/api/health` route is available for monitoring services (e.g., UptimeRobot) to periodically verify the availability of both the database and the server.

---

## Technology Stack

The primary stack chosen to support the application architecture:

- **Framework:** Next.js 16 (App Router) and React 19 with TypeScript.
- **Styling:** Tailwind CSS v4 and Lucide React.
- **Animations:** GSAP and Motion (Framer).
- **Backend & Authentication:** Next.js Server Actions and NextAuth v5.
- **Database:** Prisma ORM connected to PostgreSQL Serverless (Neon Tech).

---

## Local Development Guide

To clone and test the source code in a local development environment, follow standard initialization steps:

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/isahlopess/bakery-project.git
   cd bakery-project
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the project root and populate it with your database and authentication keys (you can use Neon Tech to quickly provision a PostgreSQL instance):
   ```env
   POSTGRES_PRISMA_URL="your_connection_string"
   POSTGRES_URL_NON_POOLING="your_non_pooling_string"
   AUTH_SECRET="your_secure_random_string"
   ```

3. **Synchronize the database and start the server:**
   ```bash
   npx prisma db push
   npm run dev
   ```

Upon initialization, navigate to `http://localhost:3000` to access the customer storefront, or append `/login` to the URL to access the administrative dashboard.