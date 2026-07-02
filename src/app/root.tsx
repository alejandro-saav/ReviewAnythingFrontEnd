import { Outlet, Scripts, ScrollRestoration, Meta, Links, type LoaderFunctionArgs, createCookie, type Cookie, data } from "react-router";
import { GetUserInfo, PostNewVisit } from "../services/UserService.ts";
import type { UserInformation } from "../types/AuthTypes.ts";
import { randomUUID } from "crypto";
import { commitSession, getSession } from "./sessions.server.ts";
import * as Sentry from "@sentry/react-router";

export async function loader({ request }: LoaderFunctionArgs) {
    // Get session cookie to identify user for sending sentry logs
    const session = await getSession(request.headers.get("Cookie"));
    const cookies: string[] | undefined = request.headers.get("Cookie")?.split(";");
    let visitCookie: Cookie | null = null;
    let userInfo: UserInformation | null = null;
    const accessToken: string | undefined = cookies?.find(c => c.substring(0, c.indexOf("=")).trim() == "accessToken");
    const visitToken: string | undefined = cookies?.find(c => c.substring(0, c.indexOf("=")).trim() == "visit_tracked");

    if (!visitToken) {
        const logVisit: boolean = await PostNewVisit(request);
        if (logVisit) {
            visitCookie = createCookie("visit_tracked", {
                maxAge: 30 * 60,
                sameSite: "strict"
            });
        }
    }
    if (accessToken) {
        userInfo = await GetUserInfo(accessToken.substring(accessToken.indexOf("=") + 1));
    }
    let userId = session.get("userId");
    if (!userId) {
        userId = userInfo?.userId || randomUUID();
        session.set("userId", userId);
    }
    Sentry.setUser({ userId: userId });
    if (visitCookie) {
        const newCookie = await visitCookie.serialize("visit_tracked");
        return data(
            { userInfo: userInfo },
            { headers: [["Set-Cookie", newCookie], ["Set-Cookie", await commitSession(session)]] }
        )
    }

    return data(
        { userInfo: userInfo },
        { headers: { "Set-Cookie": await commitSession(session) } }
    )
}

export default function Root() {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta charSet="UTF-8" />
                <Meta />
                <Links />
            </head>

            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>

        </html>
    )
}