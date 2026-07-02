import { type LoginRequest, type ForgotPasswordRequest, type RegisterRequest, type LoginResponse } from "../types/AuthTypes";
import { BASE_API_URL } from "../utils/const";
import * as Sentry from "@sentry/react-router";

export async function LoginHandler(loginRequest: LoginRequest): Promise<LoginResponse | null> {
    try {
        var response: Response = await fetch(BASE_API_URL + "/api/auth/login", {
            method: "POST",
            body: JSON.stringify(loginRequest),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            if (response.status === 400 || response.status === 409) {
                return null;
            } else {
                throw Object.assign(new Error("auth.login.failed"), {
                    status: response.status,
                });
            }
        }
        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        return null;
    }
}

export async function ConfirmEmailHandler(userId: string, token: string): Promise<boolean> {
    try {
        var response = await fetch(BASE_API_URL + `/api/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`);
        if (!response.ok) {
            throw Object.assign(new Error("auth.confirm_email.failed"), {
                status: response.status,
            });
        }
        return true;
    } catch (error) {
        Sentry.captureException(error);
        return false;
    }
}

export async function ForgotPasswordHandler(emailRequest: ForgotPasswordRequest): Promise<boolean> {
    try {
        var response = await fetch(BASE_API_URL + "/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify(emailRequest),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw Object.assign(new Error("auth.forgot_password.failed"), {
                status: response.status,
            });
        }
        return true;
    } catch (error) {
        Sentry.captureException(error);
        return false;
    }
}

export async function ResetPasswordHandler(userId: string, token: string, newPassword: string): Promise<boolean> {
    try {
        var response = await fetch(BASE_API_URL + `/api/auth/reset-password?userId=${userId}&token=${token}`, {
            method: "POST",
            body: JSON.stringify({ Password: newPassword }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw Object.assign(new Error("auth.reset_password.failed"), {
            status: response.status,
        });
        return true;
    } catch (error) {
        Sentry.captureException(error);
        return false;
    }
}

export async function RegisterUserHandler(registerRequest: RegisterRequest): Promise<boolean> {
    try {
        const formData = new FormData();
        formData.append("UserName", registerRequest.userName);
        formData.append("Email", registerRequest.email);
        formData.append("FirstName", registerRequest.firstName);
        formData.append("LastName", registerRequest.lastName ?? "");
        formData.append("Password", registerRequest.password);
        formData.append("Phone", registerRequest.phone ?? "");
        formData.append("Bio", registerRequest.bio ?? "");

        if (registerRequest.profileImage != null) {
            formData.append("ProfileImage", registerRequest.profileImage);
        }

        const response = await fetch(BASE_API_URL + "/api/auth/register", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            if (response.status === 400) {
                return false
            } else {
                throw Object.assign(new Error("auth.register.failed"), {
                    status: response.status,
                });
            }
        }
        return true;

    } catch (error) {
        Sentry.captureException(error);
        return false;
    }
}

export async function SignInWithGoogle(googleToken: string): Promise<LoginResponse | null> {
    try {
        var response = await fetch(BASE_API_URL + "/api/auth/google-signin", {
            method: "POST",
            body: JSON.stringify({ IdToken: googleToken }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        });
        if (!response.ok) throw Object.assign(new Error("auth.google_login.failed"), {
            status: response.status,
        })
        return await response.json();
    } catch (error) {
        Sentry.captureException(error);
        return null;
    }
}

export async function Logout(): Promise<boolean> {
    try {
        var response = await fetch(BASE_API_URL + "/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        if (!response.ok) throw Object.assign(new Error("auth.logout.failed"), {
            status: response.status,
        })
        return true;
    } catch (error) {
        Sentry.captureException(error);
        return false;
    }
}