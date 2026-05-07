import { redirect, type LoaderFunctionArgs } from "react-router-dom";

export async function action() {
    return redirect("/", {
        headers: {
            "Set-Cookie": "accessToken=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
        },
    });
}

export default function Logout() {
    return null;
}