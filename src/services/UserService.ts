import type { UpdateUserInfoRequest, UserInformation } from "../types/AuthTypes";
import type { UserPageData } from "../types/PagesTypes";
import type { UserComments } from "../types/ReviewTypes";
import { BASE_API_URL } from "../utils/const";

export async function GetUserInfo(userToken: string): Promise<UserInformation | null> {
    try {
        console.log("UserToken:", userToken);
        const response = await fetch(BASE_API_URL + "/api/user/summary", { headers: { "Authorization": `Bearer ${userToken}` } });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function DeleteAccount(): Promise<boolean> {
    try {
        const response = await fetch(BASE_API_URL + "/api/auth/delete-account", {
            credentials: "include",
            method: "DELETE",
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

export async function UpdateUserInfo(userInfo: UpdateUserInfoRequest): Promise<UserInformation | null> {
    try {
        const formData = new FormData();
        formData.append("FirstName", userInfo.firstName ?? "");
        formData.append("LastName", userInfo.lastName ?? "");
        formData.append("Bio", userInfo.bio ?? "");
        formData.append("DeleteImage", userInfo.deleteImage ? "true" : "false");

        if (userInfo.profileImage != null) {
            formData.append("ProfileImage", userInfo.profileImage!);
        }
        const response = await fetch(BASE_API_URL + "/api/user/summary", {
            credentials: "include",
            method: "PATCH",
            body: formData
        });
        if (!response.ok) throw new Error();
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function GetUserComments(): Promise<UserComments[] | null> {
    try {
        const response = await fetch(BASE_API_URL + "/api/comment/mycomments-page", {
            credentials: "include"
        }
        );
        if (!response.ok) throw new Error();
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function GetUserPageData(userId: number): Promise<UserPageData | null> {
    try {
        const response = await fetch(BASE_API_URL + `/api/user/${userId}/page-data`, {
            credentials: "include"
        });
        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function FollowUser(userId: number): Promise<boolean> {
    try {
        const response = await fetch(BASE_API_URL + `/api/user/${userId}/follow`, {
            credentials: "include",
            method: "POST"
        });
        if (!response.ok) return false;

        return true;
    } catch (error) {
        return false;
    }
}

export async function UnFollowUser(userId: number): Promise<boolean> {
    try {
        const response = await fetch(BASE_API_URL + `/api/user/${userId}/follow`, {
            credentials: "include",
            method: "DELETE"
        });
        if (!response.ok) return false;

        return true;
    } catch (error) {
        return false;
    }
}

export async function PostNewVisit(request: Request): Promise<boolean> {
    try {
        const userAgent = request.headers.get("User-Agent") || "Unknown";
        const acceptLanguage = request.headers.get("Accept-Language") || "Unknown";
        const forwardedHeader = request.headers.get("X-Nf-Client-Connection-Ip") || "Unknown";
        const response = await fetch(BASE_API_URL + `/api/log`, {
            method: "POST",
            headers: {
                "User-Agent": userAgent,
                "Accept-Language": acceptLanguage,
                "X-Forwarded-For": forwardedHeader
            }
        });
        if (!response.ok) return false;

        return true;
    } catch (error) {
        return false;
    }
}

export async function GetLatestUserIds(): Promise<number[] | null> {
    try {
        let idsAmount = 100;
        const response = await fetch(BASE_API_URL + `/api/user/latest?amount=${idsAmount}`, {
            credentials: "include",
        });
        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        return null;
    }
}