# 🎮 Game-Web: Enterprise-Grade Gaming Platform

![Next.js 15](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A production-ready, full-stack web application featuring real-time analytics, automated content pipelines, and scalable architecture.** This project demonstrates specific expertise in **Next.js 15 App Router**, **Server-Side Rendering (SSR)**, and **System Design**. It is built to handle high-traffic loads (10k+ concurrent users) with a focus on SEO, performance, and monetization.

---

## Technical Highlights & Engineering Decisions

### Architecture & Performance
* **Hybrid Rendering Strategy:** Utilizes **Server-Side Rendering (SSR)** for game pages (SEO) and **Client-Side Rendering (CSR)** for interactive dashboards, managed via Next.js App Router.
* **Database Design:** Normalized PostgreSQL schema on Supabase with **Row-Level Security (RLS)** policies to enforce strict data isolation.
* **Edge Optimization:** Deployed with automatic edge caching; heavy assets served via global CDN.
* **React Optimization:** Extensive use of `useMemo` and `useCallback` to prevent unnecessary re-renders, along with **Zustand** for global state persistence.

### Security & Backend
* **Role-Based Access Control (RBAC):** Custom middleware protection ensuring strict separation between User and Admin privileges.
* **Type-Safe APIs:** Server Actions integrated with **Zod** schema validation to ensure runtime type safety.
* **Soft Delete Architecture:** Implemented logic to archive games rather than delete them, preserving historical analytics integrity.

### Automation (The "Cool" Stuff)
* **ETL Pipeline:** Built a custom ingestion engine to fetch, normalize, and import 3,000+ games from external APIs in bulk.
* **Dynamic Metadata:** Leverages the Next.js Metadata API to inject SEO tags (Open Graph, Twitter Cards) dynamically from the database at request time.
* **Client-Side Caching:** Uses LocalStorage for search history to reduce database read costs for guest users.

---

## Visual Tour & Feature Deep Dive

### Part 1: The User Experience (Frontend & UI)
*Focusing on Responsive Design, Theming, and Client Interaction.*

#### UI Architecture & Theming
A fully responsive interface featuring seamless theme switching.

| **Light / Default Theme** | **Dark / Custom Theme** |
|:---:|:---:|
| <img width="100%" alt="Light Theme Interface" src="https://github.com/user-attachments/assets/0de5442f-4e7b-40df-bd79-fddf1e82874e" /> | <img width="100%" alt="Dark Theme Interface" src="https://github.com/user-attachments/assets/61d6a8a4-2482-4b5f-80c1-0a2ac221f4dd" /> |
| **Tech Highlight:** Demonstrates mastery of **Tailwind CSS** configuration and global state management. Ensures consistent design tokens (colors, typography) across the entire application. | **Tech Highlight:** Highlights attention to **User Accessibility** and modern UI standards. Implemented via CSS variables to prevent "flash of unstyled content" (FOUC). |

#### 🎮 Core Architecture & Modular Layouts
Leveraging Next.js App Router to create a scalable, reusable interface.

| **Modular Dashboard Grid** | **Dynamic Category Navigation** |
|:---:|:---:|
| <img width="100%" alt="Main Dashboard Sections" src="https://github.com/user-attachments/assets/9da3b98d-d944-48e9-9dc6-1dd1634fbdac" /> | <img width="100%" alt="Category Sidebar" src="https://github.com/user-attachments/assets/4cb6de6d-d794-44db-9d66-4d2cb7d237ad" /> |
| **Tech Highlight:** Displays a **Component-Based Architecture**. The dashboard reuses the same `GameCard` and `Grid` components across different data fetches (Featured, Trending), ensuring code maintainability. | **Tech Highlight:** Utilizes **Next.js Nested Layouts**. The Sidebar persists across navigation while the main content area refreshes. The category pages use **Dynamic Routing** (`/category/[slug]`) to render content programmatically. |

#### Client-Side Optimization & Engagement
Features focusing on user retention and browser-level performance.

| **Smart Search & Local Caching** | **Community Engagement** |
|:---:|:---:|
| <img width="100%" alt="Search with History" src="https://github.com/user-attachments/assets/05b9947b-d534-4d35-819e-f8b050ec13f8" /> | <img width="100%" alt="Comments Section" src="https://github.com/user-attachments/assets/cf3f8478-f98f-4243-8161-2979537bdc03" /> |
| **Tech Highlight:** Implements a **Multi-Parameter Search Algorithm** (matching tags, names, categories). Uniquely uses **LocalStorage** to persist search history on the client side, reducing database overhead. | **Tech Highlight:** A dynamic comments system allowing real-time user feedback. Integrates with the authentication system to verify user identity before posting, ensuring platform safety. |

#### Immersive Gameplay & Browser APIs
Handling complex state management and native browser integrations.

| **Dynamic Game Instance (Slug-Based)** | **Native Fullscreen Integration** |
|:---:|:---:|
| <img width="100%" alt="Game Player Interface" src="https://github.com/user-attachments/assets/393a44d8-2bd9-424c-9579-0b2879fa8cdc" /> | <img width="100%" alt="Fullscreen Mode" src="https://github.com/user-attachments/assets/4ae5a4b3-1cab-44ee-ab39-03d6a0c727cb" /> |
| **The Logic:** Content is hydrated via a **Dynamic Slug Strategy** (`/play/[game-id]`). The sidebar features a **Recommendation Engine** that filters games sharing similar tags/categories. | **The Engineering:** Direct interaction with the **Browser Fullscreen API**. The application manages `iframe` constraints and z-index layering to provide a distraction-free immersive environment. |

---

### Part 2: The Admin Engine (Backend & Operations)
*Focusing on Data Visualization, ETL Pipelines, and Config Management.*

#### Admin Command Center
A centralized hub for operational metrics and content management.

| **Real-Time Analytics & Oversight** |
|:---:|
| <img width="100%" alt="Admin Dashboard Overview" src="https://github.com/user-attachments/assets/c9763c0e-345f-4ec1-9bb2-b5b8573755c0" /> |
| **Why it matters:** This isn't just a static page; it aggregates live data from the database to visualize user engagement and system health. It demonstrates proficiency in **Data Visualization** (ApexCharts) and complex SQL aggregation queries via Supabase. |

#### Automated Content Aggregation Engine (ETL)
A custom-built pipeline designed to scale the platform from 10 to 10,000+ games efficiently.

| **The Configuration Interface** | **The Integration Logic in Action** |
|:---:|:---:|
| <img width="100%" alt="Mass Import UI" src="https://github.com/user-attachments/assets/acd6ec08-bcc1-4970-9c7c-deef6f48eba6" /> | <img width="100%" alt="Mass Import Functionality" src="https://github.com/user-attachments/assets/d2aa6e1a-336d-4274-9cde-cf0e1521ebcc" /> |
| **The Concept:** A dedicated interface for managing third-party feed connections (GamePix, GameMonetize). Shows the ability to build **Admin Tools** that abstract complex API parameters into a user-friendly UI. | **The Engineering:** This showcases the **Backend Integration logic**. The system fetches external JSON feeds, normalizes the disparate data structures into our strict DB schema, handles asset uploads to Supabase Storage, and performs batch insertions—all in a single flow. |

#### Content Lifecycle & Inventory Control
Advanced management systems ensuring data integrity and administrative control.

| **Game Availability Manager** |
|:---:|
| <img width="100%" alt="Game Management Interface" src="https://github.com/user-attachments/assets/629431b7-3a15-41ef-872d-6c420d1b30e5" /> |
| **The Logic:** Implements **"Soft Delete" architecture**. Instead of permanently deleting records (which breaks data integrity), admins can toggle visibility status. This ensures historical data remains intact for analytics while instantly hiding content from the frontend. |

#### Monetization & Extensibility Engine
A Wordpress-style injection system allowing dynamic site modification without code deployments.

| **Ad Placement Strategy** | **Dynamic Script Injection** |
|:---:|:---:|
| <img width="100%" alt="Ad Management" src="https://github.com/user-attachments/assets/4b23c5fc-ad68-4e99-883f-1afb2385d80b" /> | <img width="100%" alt="Script Injection" src="https://github.com/user-attachments/assets/89f694c8-c826-4fe5-9a78-a3b6d69813e0" /> |
| **Why it matters:** Configurable ad-tech integration. The system conditionally renders ad units based on route and frequency settings stored in the DB, optimizing **Core Web Vitals** (CLS) by reserving layout space dynamically. | **The Engineering:** A custom "Hook System" similar to CMS architectures. It parses the DOM structure server-side to identify injection points (anchors), allowing admins to insert third-party scripts/APIs precisely where needed. |

#### Dynamic SEO & Branding
Leveraging Next.js 15's Server-Side generation to maximize search engine visibility.

| **Asset Management (Favicons)** | **Global SEO Configuration** |
|:---:|:---:|
| <img width="100%" alt="Favicon Settings" src="https://github.com/user-attachments/assets/91fa9708-67f8-41eb-a408-edd45aff1604" /> | <img width="100%" alt="SEO Settings" src="https://github.com/user-attachments/assets/e13546d5-f85c-4f68-b615-c98c2be8c066" /> |
| **Tech Highlight:** Bypasses static asset limitations by using **Supabase Storage** for brand assets. The app dynamically serves these assets across all routes, overriding default Next.js static file serving. | **Tech Highlight:** Fully utilizes the **Next.js `generateMetadata` API**. Site names and descriptions are fetched from the DB at request time and injected into the HTML `<head>` on the server, ensuring real-time SEO updates without rebuilding the app. |

---

## Technical Stack

### Frontend
* **Framework:** Next.js 15 (App Router, Server/Client Components)
* **Library:** React 18
* **Styling:** Tailwind CSS, Radix UI, Shadcn UI
* **State:** Zustand (Global State), React Hook Form (Forms)

### Backend
* **Database:** PostgreSQL (Managed via Supabase)
* **Authentication:** Supabase Auth (JWT + OAuth/Google)
* **Storage:** Supabase Storage Buckets (Images/Assets)
* **API:** RESTful design with Next.js Server Actions

### DevOps & Tools
* **Deployment:** Vercel (CI/CD)
* **Validation:** Zod Schemas
* **Version Control:** Git

---

## Installation & Setup

### Prerequisites
* Node.js 18+ and npm/yarn
* Supabase account
* Resend API key (Email service)

### Quick Start
```bash
# Clone repository
git clone [https://github.com/Mohammed6903/GameWeb](https://github.com/Mohammed6903/GameWeb)
cd GameWeb

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# (Add your Supabase/Resend credentials to .env.local)

# Start development server
npm run dev
