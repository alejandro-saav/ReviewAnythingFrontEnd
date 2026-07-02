import { redirect, type ActionFunctionArgs } from "react-router-dom";
import type { UserInformation } from "../../../types/AuthTypes";
import * as Sentry from "@sentry/react-router";

export async function action({ request }: ActionFunctionArgs) {
    const user: UserInformation = await request.json();
    console.log("LOGOUT USER:", user);
    Sentry.logger.info("auth.logout.success", {
        userId: user.userId
    });
    return redirect("/", {
        headers: {
            "Set-Cookie": "accessToken=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
        },
    });
}

export default function Logout() {
    return null;
}