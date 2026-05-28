# ReviewAnything — Frontend

The React frontend for [ReviewAnything](https://reviewanything.site), a web app where you can review anything. Migrated from a Blazor Server app to a modern React Router + TypeScript stack.

🌐 **Live site:** [reviewanything.site](https://reviewanything.site)

> **Related repos:**
> - Backend API → [ReviewAnythingApp](https://github.com/alejandro-saav/ReviewAnythingApp)

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | React 19                            |
| Routing     | React Router v7                     |
| Language    | TypeScript                          |
| Build Tool  | Vite                                |
| Forms       | React Hook Form                     |
| Icons       | React Icons                         |
| Hosting     | Netlify                             |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alejandro-saav/ReviewAnythingFrontEnd.git
   cd ReviewAnythingFrontEnd
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file at the root pointing to the backend API:
   ```env
   VITE_API_BASE_URL=https://your-api-url-here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command            | Description                                        |
|--------------------|----------------------------------------------------|
| `npm run dev`      | Starts the development server                      |
| `npm run build`    | Builds the app for production                      |
| `npm run start`    | Serves the production build locally                |
| `npm run typecheck`| Runs type generation and TypeScript type checking  |

---

## Deployment

The app is deployed on **Netlify** using the `@netlify/vite-plugin-react-router` plugin, which handles SSR and routing automatically. The `netlify.toml` file manages build settings and redirect rules.

---

## License

This project is open source. See the repository for details.
