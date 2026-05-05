import { Outlet, Scripts, ScrollRestoration, Meta, Links, type LoaderFunctionArgs, createCookie, type Cookie, data } from "react-router";
import { GetUserInfo, PostNewVisit } from "../services/UserService.ts";
import type { UserInformation } from "../types/AuthTypes.ts";

// function AppLoader() {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         async function fetchUserInfo() {
//             const user = await GetUserInfo();
//             if (user != null) dispatch(setUser(user));
//         }

//         async function LogNewVisit(): Promise<void> {
//             if (typeof cookieStore !== "undefined") {
//                 if (await cookieStore.get("visit_tracked") != null) return;
//                 const logResponse = await PostNewVisit();
//                 if (logResponse) {
//                     try {
//                         await cookieStore.set({
//                             name: "visit_tracked",
//                             value: "1",
//                             expires: Date.now() + (30 * 60 * 1000),
//                             sameSite: "lax"
//                         });
//                     } catch (error) {
//                     }
//                 }
//             } else {
//                 if (!document.cookie.includes("visit_tracked")) {
//                     const logResponse = await PostNewVisit();
//                     if (logResponse) {
//                         document.cookie = "visit_tracked=1; max-age=1800; path=/; samesite=lax"
//                     }
//                 }
//             }
//         }
//         fetchUserInfo();
//         LogNewVisit();
//     }, [dispatch])

//     return <Outlet />
// }

export async function loader({ request }: LoaderFunctionArgs) {
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
    if (visitCookie) {
        const newCookie = await visitCookie.serialize("visit_tracked");
        return data(
            { userInfo: userInfo },
            { headers: { "Set-Cookie": newCookie } }
        )
    }

    return data(
        { userInfo: userInfo }
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