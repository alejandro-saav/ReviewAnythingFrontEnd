import type { ReactElement } from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import { Outlet, redirect } from "react-router-dom";

export async function loader({ request }: LoaderFunctionArgs) {
    const destination = new URL(request.url).pathname;
    const cookieHeader = request.headers.get("Cookie");
    const hasToken = cookieHeader?.includes("accessToken");
    if (!hasToken) {
        return redirect(`/login?from=${destination}`);
    }
    return null
}

export default function ProtectedRoutes(): ReactElement {
    return (
        <Outlet />
    )
}