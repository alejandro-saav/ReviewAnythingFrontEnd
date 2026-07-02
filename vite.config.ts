import { sentryReactRouter } from "@sentry/react-router";
import { defineConfig } from 'vite'
import { reactRouter } from "@react-router/dev/vite"
import netlifyReactRouter from "@netlify/vite-plugin-react-router"

// https://vite.dev/config/
export default defineConfig(config => ({
  plugins: [reactRouter(), netlifyReactRouter(), sentryReactRouter({
    org: "dante-2ge",
    project: "typescript-react-router",
    authToken: process.env.SENTRY_AUTH_TOKEN
  }, config)],

  resolve: {
    tsconfigPaths: true
  },

  server: {
    port: 7032
  },

  optimizeDeps: {
    exclude: ["@sentry/react-router"]
  }
}))
