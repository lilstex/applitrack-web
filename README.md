# AppliTrack - Frontend

**AppliTrack** is an AI-powered job application toolkit designed to help candidates optimize their resumes and cover letters specifically for job descriptions using OpenAI. It provides a centralized workspace to track the entire application lifecycle—from generation to getting hired.

## 🚀 Features

- **AI Resume Optimizer:** Analyzes job descriptions and your master profile to generate a tailored CV using the X-Y-Z formula.
- **Dual Template Support:** Switch between **Modern** (Emerald/Inter) and **Corporate** (Slate/Playfair) designs.
- **Application Workspace:** Edit generated content in real-time with a live-preview mode.
- **PDF Generation:** Export pixel-perfect, ATS-friendly PDFs via Puppeteer.
- **Responsive Tracking Dashboard:** Manage your job pipeline with color-coded status badges (Applied, Interviewing, Hired, etc.).
- **Master Profile Management:** Maintain a single source of truth for your experience, education, and skills.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State & Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Components:** Radix UI / Shadcn UI
- **API Client:** Axios
- **Authentication:** JWT (stored in HttpOnly Cookies via `js-cookie`)

## 📁 Project Structure

```bash
src/
├── app/
│   ├── (auth)/           # Login & Signup routes
│   ├── (dashboard)/      # Protected routes (Dashboard, Profile, Generate)
│   │   ├── dashboard/    # Application tracking table
│   │   ├── generate/     # AI Generation interface
│   │   └── profile/      # Master Profile management
│   └── layout.tsx        # Root layout with Auth detection
├── components/           # Reusable UI components (Sidebar, Tables, Badges)
├── lib/                  # API client and utility functions
├── types/                # TypeScript interfaces and Enums
└── public/               # Favicons and static assets

```

## ⚙️ Getting Started

### 1. Prerequisites

- Node.js 20+
- The AppliTrack [Backend](https://www.google.com/search?q=https://github.com/lilstex/applitrack-api) running locally or on a VPS.

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://applitrack-api.emmanuelmbagwu.net # Your VPS/Backend URL

```

### 3. Installation

```bash
npm install

```

### 4. Development

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the app.

## 📱 Mobile Responsiveness

The UI uses a **Mobile-First** approach:

- **Navigation:** Uses a slide-out drawer (`Sidebar`) on mobile and a fixed sidebar on desktop.
- **Tables:** Implements `overflow-x-auto` to allow horizontal scrolling for status and action columns on small screens.
- **Workspace:** Tab-based document editing that stacks vertically on mobile.

## 🤝 Contributing & Community

**AppliTrack** is a mission-driven project built to empower engineers and professionals in their career journeys. We believe that the community can build the best tools for the community. Whether you are a Frontend specialist, a DevOps enthusiast, or an AI Engineer, your contributions are welcome.

### How to Contribute

1. **Fork & Branch:** Fork the repository and create your feature branch from `main`:
   `git checkout -b feature/amazing-new-logic`
2. **Standardized Quality:** Ensure strict **TypeScript** types are used. We prioritize clean code and the "Don't Repeat Yourself" (DRY) principle.
3. **Document Changes:** If you add a new API interaction or a reusable component, update the internal documentation or Swagger (for backend contributors).
4. **Pull Requests:** Submit a PR with a clear description of the problem you are solving. Every PR must be reviewed and pass our CI/CD checks.

### Focus Areas for Contributors

- **AI Logic:** Improving the X-Y-Z formula prompt engineering.
- **Performance:** Optimizing Puppeteer PDF generation and frontend rendering.
- **UX/UI:** Enhancing the mobile workspace experience for editors.

## 📄 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and distribute this software. Our goal is to help as many people as possible get hired.

**Created by [Emmanuel Mbagwu**](https://linkedin.com/in/lilstex-emmanuel/)
