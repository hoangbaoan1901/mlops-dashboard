import Keycloak from "keycloak-js";

async function initializeKeycloak() {
    const keycloak = new Keycloak({
        url: `${import.meta.env.VITE_KEYCLOAK_URL}`,
        realm: `${import.meta.env.VITE_KEYCLOAK_REALM}`,
        clientId: `${import.meta.env.VITE_KEYCLOAK_CLIENTID}`,
    });
    try {
        await keycloak.init({
            onLoad: "login-required",
            checkLoginIframe: false,
            pkceMethod: "S256",
            flow: "standard",
        });
        keycloak.onTokenExpired = () => {
            console.log("Token expired, refreshing...");
            keycloak
                .updateToken(30)
                .then((refreshed) => {
                    if (refreshed) {
                        console.log("Token refreshed");
                    } else {
                        console.log("Token still valid");
                    }
                })
                .catch(() => {
                    console.error("Failed to refresh token");
                    keycloak.login();
                });
        };
        return keycloak;
    } catch (error) {
        console.error("Failed to initialize Keycloak", error);
        throw new Error("Could not connect to Keycloak.");
    }
}

export const keycloakPromise = initializeKeycloak();
