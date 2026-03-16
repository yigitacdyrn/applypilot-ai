# ApplyPilot AI

ApplyPilot AI is a full-stack job application management platform designed to help users organize their job search process, manage resumes, and analyze resume-job description compatibility through rule-based and AI-assisted matching features.

## Features

- Track job applications in a Kanban-style workflow
- Manage application statuses:
  - Saved
  - Applied
  - Interview
  - Rejected
  - Offer
- Upload resumes in PDF format
- Extract text from uploaded resumes
- Link a specific resume to a specific application
- Analyze compatibility between a resume and a job description
- View:
  - Match score
  - Matched skills
  - Missing skills
  - AI-generated summary
  - Improvement suggestion
  - Interview focus recommendation
- Monitor progress through a dashboard with summary metrics

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js App Router
- API Routes
- Prisma ORM

### Database
- Prisma Postgres (local development)

### AI / Analysis
- Rule-based skill matching
- Google Gemini API for AI-generated insights

## Pages

### Home
Landing page for navigating through the application.

### Dashboard
Provides an overview of:
- total applications
- interviews
- offers
- average match score
- recent applications
- top match applications
- resume coverage

### Applications
Kanban-style job application board where users can:
- view all applications by status
- update status
- run match analysis
- review analysis results and AI insights

### New Application
Create a new application by entering:
- company name
- job title
- linked resume
- job link
- job description
- notes

### Resumes
Upload and manage resume files, and inspect extracted text used in analysis.

## How the Analysis Works

The system performs two levels of evaluation:

### 1. Rule-Based Matching
The application compares extracted resume text with the job description and calculates:
- match score
- matched skills
- missing skills

### 2. AI-Assisted Analysis
Google Gemini generates:
- a short professional summary
- one improvement suggestion
- one interview preparation focus point

```md
GitHub: https://github.com/yigitacdyrn
LinkedIn: https://www.linkedin.com/in/mehmetyiğitaçdoyuran/