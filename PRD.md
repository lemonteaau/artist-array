### **Product Requirements Document (PRD): Artist Array - V2.1 (Community & Interaction)**

### **1. V2.0 Overview & Goal**

**Core Objective**: To transform "Artist Array" from an anonymous content utility into an engaging creator community. This will be achieved by introducing user accounts, social feedback mechanisms (likes and comments), enhanced content discovery, and more detailed submission data. The goal is to increase user retention and build a valuable, interactive platform.

---

### **2. V2.0 Core Features List**

1.  **User Authentication System**: Full implementation of user sign-up, sign-in, and sign-out.
2.  **Submission Ownership & Management**: Submissions are tied to user accounts, with options for management.
3.  **Model Selection**: Users must specify which AI model was used for their submission from a predefined list.
4.  **Liking System**: Users can "like" submissions to show appreciation.
5.  **Commenting System**: Users can comment on submissions to discuss and provide feedback.
6.  **Popularity Sorting**: The gallery can be sorted by "Most Popular" based on like counts.

---

### **3. Detailed Functional Requirements**

#### **3.1. User Authentication System**

- **New Pages**: Create `/login` and `/signup` pages with forms for email/password authentication.
- **Navigation Bar State**:
  - **Logged-out State**: The navbar displays "Login" and "Sign Up" buttons.
  - **Logged-in State**: The navbar displays the user's avatar, which opens a dropdown menu with links (e.g., "Profile", "Sign Out").
- **Technology**: Fully implement Supabase Auth using the `@supabase/ssr` library for robust session management.

#### **3.2. Submission Ownership & Management**

- **Submission Flow Change**:
  - The `/upload` page must now be a **protected route**, accessible only to logged-in users.
  - When a logged-in user submits a new Artist Array, their `user_id` **must** be recorded in the corresponding row in the `prompts` table.
- **Content Management**:
  - On the Submission Detail Page (`/prompt/[id]`), a "Delete" button must be visible **if and only if** the currently logged-in user is the owner of the submission.
  - Clicking the "Delete" button will remove the prompt and all its associated data (likes, comments).

#### **3.3. Model Selection**

- **Database Prerequisite (Already Completed)**: The `prompts` table has been updated with a new required (`NOT NULL`) column named `model`. This column's type is a database `ENUM` (`model_type`), which contains a predefined list of supported models. The agent should assume this column exists.
- **Submission Page (`/upload`) UI/UX Task**:
  - The submission form must include a new, required field labeled "Model".
  - This field **must be a dropdown select menu**, not a free-text input field. Its options must be sourced from the list of supported models.
- **Detail Page (`/prompt/[id]`) UI Task**: The page must display the name of the model that was used for the submission.

#### **3.4. Liking System**

- **UI**: A "Like" button (e.g., a ❤️ icon) and a real-time like count must be present on each gallery card and on the detail page.
- **Interaction**:
  - The button functions as a **toggle**.
  - Only logged-in users can like/unlike. A logged-out user clicking the button should be prompted to log in.
- **Backend**: Create/delete records in the `likes` table based on user actions.

#### **3.5. Commenting System**

- **UI**: On the detail page (`/prompt/[id]`), add a comment section with a **comment input form** and a **list of existing comments**.
- **Interaction**:
  - Only logged-in users can post new comments.
  - Each comment in the list should display the commenter's **avatar, username, the comment text, and a timestamp**.
  - Users must be able to delete their own comments.

#### **3.6. Popularity Sorting**

- **UI**: On the homepage (`/`), the "Popular" sort option should be functional.
- **Backend Logic**: When this sort is selected, the query to fetch prompts must `JOIN` with the `likes` table, get the count of likes for each prompt, and `ORDER BY` that count in descending order.

---

### **4. Backend & Database Changes**

- **RLS Policies**: Row Level Security policies **must be enabled and fully configured** for the `prompts`, `likes`, and `comments` tables. This is a critical task for the agent.
  - Example: Users can only `INSERT` likes or comments as themselves (`WITH CHECK (auth.uid() = user_id)`).
  - Example: Users can only `DELETE` their own submissions, likes, or comments (`USING (auth.uid() = user_id)`).
- **Database Schema (Confirmation of Current State)**: The agent should assume the database schema is in the following state and build upon it:
  - An `ENUM` type named `model_type` exists.
  - The `prompts` table contains a `model model_type NOT NULL` column.
  - The `prompts.user_id` field exists and is ready to be used.
  - The `likes` table exists with a composite primary key on `(user_id, prompt_id)`.
  - The `comments` table exists.
- **API Changes**: The `POST /api/prompts` endpoint must now be a protected route that extracts the `user_id` from the authenticated session and validates the incoming `model` field.

---

### **5. Suggested Development Plan (Phased Rollout)**

1.  **Phase 2.1 (Foundation)**: Implement the complete User Authentication system (login, signup, signout, and dynamic navbar).
2.  **Phase 2.2 (Core Submission Flow)**: Update the submission process. Protect the `/upload` route, link submissions to users, and implement the UI for the **Model Selection** feature. Implement the "delete own post" functionality.
3.  **Phase 2.3 (Core Interaction)**: Implement the Liking system and activate the "Most Popular" sort on the homepage.
4.  **Phase 2.4 (Deeper Interaction)**: Implement the full commenting system.
