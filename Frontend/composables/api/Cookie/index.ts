import Cookie from "./cookie";

interface CookieInterface {
    setCookie: (token: string, userType: string) => Promise<void>;
    getCookie: () => Promise<{ userToken: string | null; adminToken: string | null }>;
    deleteCookie: () => Promise<void>;
}

const useCookie = (): CookieInterface => {
    const cookie = new Cookie();

    return {
        setCookie: (token: string, userType: string) => cookie.setCookie(token, userType),
        getCookie: () => cookie.getCookie(),
        deleteCookie: () => cookie.deleteCookie()
    };
};

export default useCookie;
