import type { UpdateUserInfoRequest, UserInformation } from "../types/AuthTypes";
import type { UserPageData } from "../types/PagesTypes";
import type { UserComments } from "../types/ReviewTypes";
import { BASE_API_URL } from "../utils/const";

export async function GetUserInfo(userToken: string): Promise<UserInformation | null> {
    try {
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

export async function UpdateUserInfo(userInfo: FormData, authToken: string): Promise<UserInformation | null> {
    try {
        const response = await fetch(BASE_API_URL + "/api/user/summary", {
            headers: {
                "Authorization": `Bearer ${authToken}`
            },
            method: "PATCH",
            body: userInfo
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

export async function FollowUser(userId: number, authToken: string): Promise<boolean> {
    try {
        const response = await fetch(BASE_API_URL + `/api/user/${userId}/follow`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });
        if (!response.ok) return false;

        return true;
    } catch (error) {
        return false;
    }
}

export async function UnFollowUser(userId: number, authToken: string): Promise<boolean> {
    try {
        const response = await fetch(BASE_API_URL + `/api/user/${userId}/follow`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
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