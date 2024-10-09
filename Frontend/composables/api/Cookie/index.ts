import Cookie from "./cookie";

interface CookieInterface {
    setCookie: (token: string, userType: string) => Promise<void>;
    getCookie: () => Promise<{ userToken: string | null; adminToken: string | null }>;
    deleteCookie: (token: string, userType: string) => Promise<void>;
}

const useCookie = (): CookieInterface => {
    const cookie = new Cookie();

    return {
        setCookie: (token: string, userType: string) => cookie.setCookie(token, userType),
        getCookie: () => cookie.getCookie(),
        deleteCookie: (token: string, userType: string) => cookie.deleteCookie(token, userType)
    };
};

export default useCookie;
