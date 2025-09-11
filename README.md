Live link : https://genui-preview.vercel.app/
# GenUI Studio – Frontend  

A modern React frontend for an AI‑assisted component editor. Chat with an AI to generate, iterate, and preview UI components in real time, with a clean developer experience and polished UX.

## What it does
- Provides a chat‑driven interface to request components and refinements (e.g., “make the button primary and add a badge”).
- Supports an **Edit Mode** to modify existing components: select any generated component, ask for targeted changes, and preview diffs live before applying.
- Shows a live preview of the generated/updated React component and properties.
- Manages conversation context so the AI can iterate on prior requests.
- Surfaces component history so you can reuse or compare versions.
- Integrates with the backend for authentication, sessions, conversations, and messages.

## Features
- **AI Chat Editor**: Conversational UI to generate and refine components.
- **Edit Mode**: Toggle into editing for any prior component, request precise changes (e.g., layout, props, styles), review changes in a safe preview, and confirm to apply.
- **Live Preview**: Real‑time rendering of generated React code with safe isolation.
- **Property Panel**: Tweak props and see instant visual updates.
- **Component History**: Browse previous iterations and restore.
- **Session‑aware UI**: Protected routes and user state handling.
- **Error Boundaries**: Friendly error states and safe fallbacks.
- **Responsive Design**: Tailwind‑driven layout that adapts to all screens.

## Tech Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State**: Zustand stores (session, editor, chat)
- **Icons & UI**: (e.g., Lucide React as needed)


## Images

<img
  width="1920"
  height="919"
  alt="Screenshot 2025-09-11 141229"
  src="https://github.com/user-attachments/assets/1f4bc1e8-93f1-4d62-9d0a-aa440f866904"
  style="margin-bottom: 30px;" 
/>

<img
  width="1914"
  height="905"
  alt="image"
  src="https://github.com/user-attachments/assets/fe8cb500-bacf-4b91-be46-df06c870b9c3"
/>



## Notes
- This frontend expects the backend API for auth, conversations, messages, and quotas.
