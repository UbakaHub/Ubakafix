# UbakaFix

UbakaFix is a modern, user-friendly platform that simplifies the building permit process in Rwanda. From submitting construction documents to validating them and tracking progress, UbakaFix supports applicants every step of the way.

## Purpose

Built with the goal of making construction applications easier, faster, and smarter — UbakaFix is designed for citizens, not bureaucracy. It helps individuals prepare their documents properly, ensures submissions meet key compliance criteria, and gives every applicant a clear way to track their progress.

## Key Features

-  **Dynamic Document Uploads**  
  Users are only shown the documents required for *their* specific permit type and building category.

-  **Smart Submission Validation**  
  Before submitting, applicants can review their package and are guided through corrections if something’s missing.

-  **Tracking Code System**  
  Each submission gets a unique tracking code (e.g. `UBK-20250629-3480`) that the user can use to check status updates.

-  **Supabase Integration**  
  All documents are securely uploaded to Supabase Storage. Application data is stored in a Supabase PostgreSQL database.

-  **Live Application Status**  
  Applicants can check the current status of their application anytime.

## Tech Stack

- **Frontend**: React + TypeScript  
- **Backend**: Node.js (API endpoints for document rules + zip preview)  
- **Database**: Supabase (PostgreSQL)  
- **Storage**: Supabase Storage  
- **Styling**: Custom Vanilla CSS (with global tokens and utilities)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ubakahub/UbakaFix.git
cd UbakaFix
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

# Backend API (Minimal)

The backend exposes:

* `GET /api/document-rules/:category/:permit` – fetch document requirements
* `POST /api/create-zip-preview` – generate file previews for review

---

# Next on the Roadmap

* 🧾 Permit Certificate Generator
* 🧠 Rule Engine for Auto-Checking Compliance
* 🛰️ Zoning Integration (UbakaZone)
* 🛍️ UbakaStore & Contractor Recommendations
* 📲 SMS & Email Notifications


# Built With Love By

Agnes Kamirindi and the UbakaHub team 💙
[ALX Incubator 2025 Cohort]