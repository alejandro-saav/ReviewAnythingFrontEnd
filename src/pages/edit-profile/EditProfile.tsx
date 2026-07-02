import { type UpdateUserInfoRequest, type UserInformation } from "../../types/AuthTypes";
import { GetAccessTokenFromRequest, isNullOrWhiteSpace } from "../../utils/helperFunctions";
import LoadingSpinner from "../../components/loadingComponents/LoadingSpinner";
import { useState } from "react";
import styles from "./EditProfile.module.css";
import { useForm, type SubmitHandler } from "react-hook-form";
import { DeleteAccount, UpdateUserInfo } from "../../services/UserService";
import { redirect, useFetcher, useRouteLoaderData } from "react-router-dom";
import type { loader as rootLoader } from "../../app/root";
import type { ClientActionFunctionArgs, MetaFunction } from "react-router";
import * as Sentry from "@sentry/react-router";

export const meta: MetaFunction = () => {
    return [
        { title: "Edit Profile | ReviewAnything" },
        { name: "description", content: "Update your ReviewAnything profile information, bio, and profile picture." },
        { name: "robots", content: "noindex, nofollow" },
        { tagName: "link", rel: "canonical", href: "https://reviewanything.site/edit-profile" },
    ];
};

export async function action({ request }: ClientActionFunctionArgs) {
    const authToken = GetAccessTokenFromRequest(request);
    if (request.method == "POST") {
        const data: FormData = await request.formData();
        if (!authToken) return redirect("/");
        const updateProfileDataRequest = await UpdateUserInfo(data, authToken);
        if (!updateProfileDataRequest) {
            Sentry.logger.info("profile.update.failed");
            return { postActionError: "Something went wrong, please try again." }
        } else {
            Sentry.logger.info("profile.update.success");
        }
    } else {
        if (!authToken) return redirect("/");
        const deleteResponse = await DeleteAccount();
        if (!deleteResponse) {
            Sentry.logger.info("account.delete.failed");
            return { deleteError: "Could not delete your account. Please try again." }
        }
        Sentry.logger.info("account.delete.success");
        return redirect("/");
    }
}

export default function EditProfile() {
    const user: UserInformation = useRouteLoaderData<typeof rootLoader>("root")!.userInfo!;
    const saveFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    const saveActionData = saveFetcher.data;
    const deleteActionData = deleteFetcher.data;

    const { register, handleSubmit, formState: { errors, isDirty }, setValue } = useForm<UpdateUserInfoRequest>({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            profileImage: null,
            deleteImage: false,
        }
    });
    const [imageErrorMessage, setImageErrorMessage] = useState<string | null>(null);
    const [imageNameSelected, setImageNameSelected] = useState<string | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(user.profileImage);

    function HandleRemovePhoto() {
        setImageNameSelected(null);
        setImagePreviewUrl("");
        setValue("deleteImage", true, { shouldDirty: true });
    }
    function HandleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
        setImageErrorMessage(null);
        setImageNameSelected(null);
        const maxFileSize: number = 1024 * 1024 * 2;

        const file: File | undefined = e.target.files?.[0];
        if (!file || file === undefined) {
            setImageErrorMessage("No file found.");
        };
        if (file!.size > maxFileSize) {
            setImageErrorMessage("File is too big, max size is 2MB");
            return;
        }

        if (file!.type.substring(0, 5) != "image") {
            setImageErrorMessage("File type is not supported. Only images are supported.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const imageName = file!.name;
            const imageExtension = imageName.substring(imageName.lastIndexOf("."));
            const imageNameTruncated = imageName.length <= 15 ? imageName : `${imageName.substring(0, 10)}...${imageExtension}`;
            setImageNameSelected(imageNameTruncated);
            setImagePreviewUrl(reader.result as string);
        }
        reader.readAsDataURL(file!);
        setValue("profileImage", e.target.files?.[0] ?? null, { shouldDirty: true });
        setValue("deleteImage", false);
    }

    async function HandleDeleteAccount(): Promise<void> {
        if (!window.confirm("Permanently delete your account? This cannot be undone.")) return;
        deleteFetcher.submit(null, { method: "DELETE" });
    }

    const onSubmit: SubmitHandler<UpdateUserInfoRequest> = async (data) => {
        const formData = new FormData();
        formData.append("firstName", data.firstName ?? "");
        formData.append("lastName", data.lastName ?? "");
        formData.append("bio", data.bio ?? "");
        formData.append("deleteImage", data.deleteImage ? "true" : "false");

        if (data.profileImage != null) {
            formData.append("profileImage", data.profileImage!);
        }
        saveFetcher.submit(formData, { method: "POST", encType: "multipart/form-data" });
    }
    return (
        <div className={styles.editProfileContainer}>
            <div className={styles.editProfileWrapper}>
                <div className={styles.header}>
                    <h1>Edit Profile</h1>
                    <p>Update your profile information</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.profileImageSection}>
                        <div className={styles.uploadContainer}>
                            {isNullOrWhiteSpace(imagePreviewUrl) ?
                                <label className={styles.svgContainer} htmlFor="profile-upload">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 24 24"
                                        fill="none">
                                        <circle cx="12" cy="12" r="11" stroke="#FE5D26" strokeWidth="2" fill="none" />
                                        <path
                                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                            fill="#FE5D26" />
                                    </svg>
                                    <span className={styles.plusSign}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-25 h-25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </span>
                                </label>
                                :
                                <label htmlFor="profile-upload">
                                    <div className={styles.imagePreview} id="imagePreview">
                                        <img className={styles.previewImg} src={imagePreviewUrl!} alt="Profile Preview" />
                                        <button type="button" className={styles.removeBtn} onClick={HandleRemovePhoto}>×</button>
                                        {!isNullOrWhiteSpace(imageErrorMessage) &&
                                            <div className={`${styles.errorMessage} ${styles.imgErrorMessage}`}
                                                style={{ marginBottom: "10px" }}> {imageErrorMessage}
                                            </div>
                                        }
                                    </div>
                                </label>
                            }
                            <input id="profile-upload" accept="image/*" onChange={HandleImageSelected} name="profileImage" type="file" style={{ display: "none" }} />
                            {imageNameSelected && <span>{imageNameSelected}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="firstName">First Name</label>
                        <input {...register("firstName", { required: { value: true, message: "Firstname is required" }, maxLength: { value: 30, message: "Max 30 characters" }, minLength: { value: 3, message: "Min 3 characters." } })} type="text" id="firstName" name="firstName" className={styles.formInput} placeholder={user.firstName ? user.firstName : "Enter your first name"} />
                        {errors.firstName && <div className={styles.validationError}>{errors.firstName.message}</div>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="lastName">Last Name</label>
                        <input {...register("lastName", { maxLength: { value: 30, message: "Max 30 characters" } })} type="text" id="lastName" name="lastName" className={styles.formInput}
                            placeholder={user.lastName ? user.lastName : "Enter your last name"} />
                        {errors.lastName && <div className={styles.validationError}>{errors.lastName.message}</div>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="bio">Bio</label>
                        <textarea {...register("bio", { maxLength: { value: 500, message: "Max 500 characters" } })} id="bio" name="bio" className={`${styles.formInput} ${styles.textarea}`}
                            placeholder={user.bio ? user.bio : "Tell us about yourself..."}></textarea>
                        {errors.bio && <div className={styles.validationError}>{errors.bio.message}</div>}
                    </div>

                    <div className={styles.actionButtons}>
                        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={!isDirty}>
                            {saveFetcher.state == "submitting" ?
                                <LoadingSpinner />
                                :
                                <span>Save Changes</span>
                            }
                        </button>
                    </div>
                    {saveActionData?.postActionError && <span className={styles.validationError}>{saveActionData.postActionError}</span>}
                </form>

                <div className={styles.dangerZone}>
                    <h2 className={styles.dangerZoneTitle}>Danger zone</h2>
                    <p className={styles.dangerZoneText}>
                        Permanently delete your account and associated profile data. This cannot be undone.
                    </p>
                    <button
                        type="button"
                        className={styles.deleteAccountBtn}
                        onClick={HandleDeleteAccount}
                        disabled={deleteFetcher.state == "submitting"}
                    >
                        {deleteFetcher.state == "submitting" ? <LoadingSpinner /> : "Delete account"}
                    </button>
                    {deleteActionData?.deleteError && (
                        <div className={styles.validationError}>{deleteActionData?.deleteError}</div>
                    )}
                </div>
            </div>
        </div>
    );
}