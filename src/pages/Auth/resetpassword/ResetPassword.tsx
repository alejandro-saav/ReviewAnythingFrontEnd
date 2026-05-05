import { type ReactElement, useState } from "react";
import { isNullOrWhiteSpace } from "../../../utils/helperFunctions";
import { Link, useSearchParams, type MetaFunction } from "react-router-dom";
import { ResetPasswordHandler } from "../../../services/AuthService";
import styles from "./ResetPassword.module.css";


export const meta: MetaFunction = () => {
    return [
        { title: "Reset Password | ReviewAnything" },
        { name: "description", content: "Create a new password for your ReviewAnything account." },
        { name: "robots", content: "noindex, nofollow" },
        { tagName: "link", rel: "canonical", href: "https://reviewanything.site/reset-password" },
    ];
};

export default function ResetPassword(): ReactElement {
    type formState = {
        password: string,
        confirmPassword: string
    }
    const [loading, setLoading] = useState<boolean>();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>();
    const [form, setForm] = useState<formState>({
        password: "",
        confirmPassword: ""
    });


    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const [searchParam] = useSearchParams();
    const userId: string | null = searchParam.get("userId");
    const token: string | null = searchParam.get("token");

    async function SubmitHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        if (isNullOrWhiteSpace(userId) || isNullOrWhiteSpace(token) || isNullOrWhiteSpace(form.password) || isNullOrWhiteSpace(form.confirmPassword) || form.password !== form.confirmPassword) {
            setLoading(false);
            setError("Unable to reset password. Check the passwords match and met all the constraints. If not try sending a new reset password to your email.");
            return;
        }

        var response = await ResetPasswordHandler(userId!, token!, form.password);
        if (response) {
            setSuccess(true);
        } else {
            setSuccess(false);
            setError("Unable to reset password. Check the passwords match and met all the constraints. If not try sending a new reset password to your email.");
        }

        setLoading(false);
    }
    return (
        <div className={styles.resetPasswordContainer}>

            <div className={styles.resetPasswordWrapper}>
                <div className={styles.logo}>
                    <h1>ReviewAnything</h1>
                </div>

                {success
                    ?
                    <div className={styles.successMessage}>
                        Your password has been reset successfully. You can now sign in with your new password.
                    </div>
                    :
                    <>
                        <h2 className={styles.subtitle}>Reset Your Password</h2>

                        <div className={styles.passwordRequirements}>
                            <h4>Password Requirements:</h4>
                            <ul>
                                <li>At least 8 characters long</li>
                                <li>Contains uppercase and lowercase letters</li>
                                <li>Contains at least one number</li>
                                <li>Contains at least one special character</li>
                            </ul>
                        </div>

                        <form onSubmit={SubmitHandler}>

                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword">New Password</label>
                                <div className={styles.inputWrapper}>
                                    <input type="password"
                                        placeholder="Password" className={styles.formInput} id="newPassword" name="password" onChange={handleChange} />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className={styles.inputWrapper}>
                                    <input type="password"
                                        placeholder="Confirm Password" className={styles.formInput} id="confirmPassword" name="confirmPassword" onChange={handleChange} />
                                </div>
                            </div>

                            <button type="submit" className={styles.btnPrimary} disabled={loading}>
                                {loading ?
                                    <div className={styles.spinnerContainer}>
                                        <span className={styles.spinner}></span>
                                        <span>Loading...</span>
                                    </div>
                                    :
                                    <span>Reset Password</span>
                                }
                            </button>
                            {!isNullOrWhiteSpace(error) &&
                                <div className={styles.errorMessage}>{error}</div>
                            }
                        </form>
                    </>
                }

                <div className={styles.backLink}>
                    <Link to="/login">← Back to Login</Link>
                </div>
            </div>
        </div>
    )
}