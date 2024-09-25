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
