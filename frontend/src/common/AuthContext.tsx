import React, { useEffect } from "react";
import { keycloakPromise } from "./Keycloak";
import axios from "axios";

const AuthContext = React.createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isKeycloakAuthenticated, setIsKeycloakAuthenticated] =
        React.useState(false);
    const [isBackendConnected, setIsBackendConnected] = React.useState(false);
    const [keycloak, setKeycloak] = React.useState<any>(null);

    useEffect(() => {
        const initializeKeycloak = async () => {
            try {
                // initialize Keycloak
                const kc = await keycloakPromise;
                setKeycloak(kc);
                setIsKeycloakAuthenticated(kc.authenticated);
                kc.onTokenExpired = () => {
                    console.log("Token expired, refreshing...");
                    kc.updateToken(30)
                        .then((refreshed) => {
                            if (refreshed) {
                                console.log("Token refreshed");
                            } else {
                                console.log("Token still valid");
                            }
                        })
                        .catch(() => {
                            console.error("Failed to refresh token");
                            kc.login();
                        });
                };
                // axios to backend to verify connection
                if (kc.authenticated) {
                    const userID = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/users`,
                        {
                            headers: {
                                Authorization: `Bearer ${kc.token}`,
                            },
                        }
                    );
                    if (userID.status === 200 || userID !== null) {
                        setIsBackendConnected(true);
                    } else {
                        setIsBackendConnected(false);
                    }
                }
            } catch (error) {
                console.error("Error during authentication process", error);
            }
        };
        initializeKeycloak();
    }, []);

    return (
        <AuthContext.Provider
            value={{ isKeycloakAuthenticated, isBackendConnected, keycloak }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
