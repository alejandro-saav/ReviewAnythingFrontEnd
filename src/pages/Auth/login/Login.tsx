import { type ReactElement, useState } from "react";
import type { LoginRequest } from "../../../types/AuthTypes";
import { LoginHandler, SignInWithGoogle } from "../../../services/AuthService";
import { Link, redirect, useFetcher, useSearchParams, type ActionFunctionArgs, type ClientLoaderFunctionArgs, type MetaFunction } from "react-router-dom";
import GoogleBtn from "../../../components/GoogleBtn";
import styles from "./Login.module.css";

export async function loader({ request }: ClientLoaderFunctionArgs) {
    const url: URL = new URL(request.url);
    const searchParams: URLSearchParams = url.searchParams;
    const googleCode: string | null = searchParams.get("code");
    const from: string | null = searchParams.get("state");
    if (googleCode) {
        const googleResponse = await SignInWithGoogle(googleCode);
        if (googleResponse) {
            return redirect(from ?? "/", {
                headers: {
                    "Set-Cookie": `accessToken=${googleResponse.token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`,
                },
            });
        }
    }
    return {}
}

export const meta: MetaFunction = () => {
    return [
        { title: "Login | ReviewAnything" },
        { name: "description", content: "Log in to your ReviewAnything account to write reviews, like, and engage with the community." },
        { name: "robots", content: "noindex, nofollow" },
        { tagName: "link", rel: "canonical", href: "https://reviewanything.site/login" },
    ];
};

export async function action({ request }: ActionFunctionArgs) {
    const loginData = await request.json();
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const response = await LoginHandler(loginData);
    if (!response) {
        return { error: "Invalid username or password" }
    }
    return redirect(from || "/", {
        headers: { "Set-Cookie": `accessToken=${response.token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800` },
    });
}

export default function Login(): ReactElement {
    let fetcher = useFetcher();
    const [form, setForm] = useState<LoginRequest>({
        email: "",
        password: "",
        rememberMe: false
    });

    const [searchParams] = useSearchParams();
    const googleError: string | null = searchParams.get("error");
    const from = searchParams.get("from") || "/";

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        fetcher.submit({ ...form }, { method: "POST", encType: "application/json" });
    }
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginWrapper}>
                <div className={styles.loginPanel}>
                    <h2 className={styles.panelTitle}>Login</h2>
                    <form method="post" id="loginForm" onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="Email">Email</label>
                            <input type="text" id="Email" name="Email"
                                onChange={handleChange} className={styles.formInput}
                                placeholder="Email Address" />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="Password">Password</label>
                            <input type="password" id="Password" name="Password" onChange={handleChange}
                                className={styles.formInput} placeholder="Password" />
                        </div>

                        <div className={styles.formOptions}>
                            <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
                        </div>

                        <button type="submit" className={styles.btnPrimary} id="submitLoginBtn" disabled={fetcher.state == "submitting"}>
                            {fetcher.state == "submitting" ?
                                <div className={styles.spinnerContainer} id="loadingSpinner">
                                    <span className={styles.spinner}></span>
                                    <span>Loading...</span>
                                </div>
                                :
                                <span id="loginBtnText">Login</span>
                            }
                        </button>

                        {fetcher.data?.error &&
                            <div className={styles.errorMessage}>{fetcher.data.error}</div>
                        }
                    </form>

                    <div className={styles.needAccount}><span>Need an account? <Link to="/signup">Sign up</Link></span></div>

                    <div className={styles.divider}>or</div>
                    <GoogleBtn from={from} />
                    {googleError && <span className={styles.errorMessage}>Something went wrong while trying to sign you in with google. Please try again.</span>}
                </div>
            </div>
        </div>
    )
}