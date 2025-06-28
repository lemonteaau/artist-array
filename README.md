# 🎨 Artist Array

Artist Array is a web platform designed for the AI art community to share, discover, and utilize "Artist Strings"—curated lists of artist names used to define specific art styles in AI image generation models like NovelAI and Stable Diffusion.

This platform moves these valuable "recipes" from scattered social media posts into a structured, searchable, and interactive gallery.

**Live Demo:** `[Link to your deployed website]` _(You can add this later)_

_(To make this work, add a screenshot of your app named `screenshot.png` inside the `/public` directory of your project)_

---

## ✨ Core Features

- **🖼️ Gallery View**: Browse an infinite-scrolling gallery of AI art submissions.
- **📋 Discover & Copy**: View detailed information for each submission, including the full Artist String, prompt, and model used, with easy-to-copy buttons.
- **🚀 Open Submissions**: Anonymously share your own creations with the community via a simple upload form.
- **🤖 Model Filtering**: See which AI model (e.g., NAI Diffusion V3, V4.5) was used for each piece.
- **❤️ Community Interaction (V2)**: Log in to like and comment on your favorite submissions.
- **🔥 Popularity Sorting (V2)**: Sort the gallery to see the "Most Popular" or "Newest" creations.

## 🔧 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & DB**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS)
- **Image Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### 1\. Prerequisites

- Node.js (v18 or later)
- npm, pnpm, or yarn

### 2\. Clone the Repository

```bash
git clone https://github.com/your-username/artist-array.git
cd artist-array
```

### 3\. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 4\. Set up Supabase

1.  Go to [supabase.com](https://supabase.com/) and create a new project.
2.  Inside your project, go to the **SQL Editor**.
3.  Copy the entire content of the `schema.sql` file from this repository and run it to create the necessary tables (`prompts`, `likes`, `comments`) and the `model_type` ENUM.
4.  Set up Supabase
    Go to supabase.com and create a new project.
    Inside your project, go to the SQL Editor.
    Copy the entire content of the schema.sql file from this repository and run it to create the necessary tables (prompts, likes, comments) and the model_type ENUM.
    Set up Row Level Security (RLS) policies. Go to the SQL Editor again and run the SQL commands found in rls_policies.sql to secure your tables.

### 5\. Set up Cloudflare R2

1.  Go to your Cloudflare dashboard and create a new R2 bucket.
2.  In the bucket's **Settings**, enable the **Public Development URL** (e.g., `https://pub-....r2.dev`).
3.  Go to **R2 \> Manage R2 API Tokens** and create a new API token with "Object Read & Write" permissions. Securely copy the `Access Key ID` and `Secret Access Key`.

### 6\. Environment Variables

1.  Create a new file named `.env.local` in the root of your project.
2.  Copy the contents of `.env.example` (see below) into your new `.env.local` file.
3.  Fill in the values from your Supabase and Cloudflare R2 projects.

#### `.env.example`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Cloudflare R2
# Find this in your R2 dashboard overview
CLOUDFLARE_R2_ACCOUNT_ID=YOUR_R2_ACCOUNT_ID
# From the R2 API Token you created
CLOUDFLARE_R2_ACCESS_KEY_ID=YOUR_R2_ACCESS_KEY_ID
CLOUDFLARE_R2_SECRET_ACCESS_KEY=YOUR_R2_SECRET_ACCESS_KEY
# The name of the bucket you created
CLOUDFLARE_R2_BUCKET_NAME=artist-array-images
# The public URL for your bucket (e.g., https://pub-....r2.dev)
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=YOUR_R2_PUBLIC_URL
```

### 7\. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
