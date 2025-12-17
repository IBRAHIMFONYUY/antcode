# AntCodeHub

Welcome to **AntCodeHub**, a modern platform designed to connect aspiring tech professionals with industry experts for mentorship, structured learning, and career acceleration. This project is built with Next.js, TypeScript, Tailwind CSS, and Firebase.

![AntCodeHub Screenshot](https://picsum.photos/seed/app-screenshot/1200/630)

## ✨ Features

-   **Expert Mentorship:** Find and book sessions with vetted industry experts.
-   **Structured Learning Paths:** Enroll in courses to learn in-demand skills.
-   **Role-Based Dashboards:** Separate, tailored experiences for students and mentors.
-   **Firebase Integration:** Secure authentication and a real-time database with Firestore.
-   **AI-Powered Feedback:** Genkit-powered AI to assist mentors in reviewing student tasks.
-   **Responsive Design:** A beautiful, modern UI that works on all devices, built with ShadCN and Tailwind CSS.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   pnpm (or npm/yarn)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/antcodehub.git
    cd antcodehub
    ```

2.  **Install dependencies:**
    ```sh
    pnpm install
    ```

3.  **Set up Firebase:**
    -   This project is pre-configured to connect to a Firebase project. The configuration is located in `src/firebase/config.ts`.
    -   Ensure your Firebase project has **Email/Password** and **Google** sign-in methods enabled in Firebase Authentication.
    -   Firestore is used for storing user data. Your project's security rules should be configured to allow reads and writes for authenticated users.

4.  **Run the development server:**
    ```sh
    pnpm dev
    ```
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 🛠 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
-   **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
-   **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit)
-   **Form Management:** [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation:** [Zod](https://zod.dev/)

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
