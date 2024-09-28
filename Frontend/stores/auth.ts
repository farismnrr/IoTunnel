// stores/auth.ts
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => {
        return {
            accessTokenUser: "",
            accessTokenAdmin: ""
        };
    },
    actions: {
        getAccessTokenUser() {
            return this.accessTokenUser;
        },
        getAccessTokenAdmin() {
            return this.accessTokenAdmin;
        },
        setAccessTokenUser(token: string) {
            this.accessTokenUser = token;
        },
        setAccessTokenAdmin(token: string) {
            this.accessTokenAdmin = token;
        },
        updateAccessTokenUser(token: string) {
            this.accessTokenUser = token;
        },
        updateAccessTokenAdmin(token: string) {
            this.accessTokenAdmin = token;
        },
        deleteAccessTokenUser() {
            this.accessTokenUser = "";
        },
        deleteAccessTokenAdmin() {
            this.accessTokenAdmin = "";
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.sessionStorage()
    }
});

export const useTokenStore = defineStore("token", {
    state: () => ({
        refreshToken: ""
    }),
    actions: {
        setRefreshToken(token: string) {
            this.refreshToken = token;
        },
        getRefreshToken() {
            return this.refreshToken;
        }
    }
});
