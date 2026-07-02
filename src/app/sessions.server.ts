import { createCookieSessionStorage } from "react-router";

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: "__session",
        secrets: [process.env.SESSION_COOKIE_SECRET_KEY ?? ""],
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax"
    }
});