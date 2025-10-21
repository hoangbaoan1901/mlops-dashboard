import React, { useEffect, useRef } from "react";
import { keycloakPromise } from "./Keycloak";
import axios from "axios";

const AuthContext = React.createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isKeycloakAuthenticated, setIsKeycloakAuthenticated] =
        React.useState(false);
    const [isBackendConnected, setIsBackendConnected] = React.useState(false);
    const [keycloak, setKeycloak] = React.useState<any>(null);
    const refreshIntervalRef = useRef<number | null>(null);

    // Function to refresh token
    const refreshToken = async (kc: any) => {
        try {
            const refreshed = await kc.updateToken(30);
            if (refreshed) {
                console.log("Token refreshed proactively");
            } else {
                console.log("Token still valid, no need to refresh");
            }
            return true;
        } catch (error) {
            console.error("Failed to refresh token", error);
            kc.login(); // Force re-login if refresh fails
            return false;
        }
    };

    useEffect(() => {
        const initializeKeycloak = async () => {
            try {
                // initialize Keycloak
                const kc = await keycloakPromise;
                setKeycloak(kc);
                setIsKeycloakAuthenticated(kc.authenticated);
                
                // Set up token expiration handler
                kc.onTokenExpired = () => {
                    console.log("Token expired, refreshing...");
                    refreshToken(kc);
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
                    
                    // Set up interval to check and refresh token every 5 minutes
                    // Convert 5 minutes to milliseconds: 5 * 60 * 1000 = 300000
                    refreshIntervalRef.current = window.setInterval(() => {
                        console.log("Checking token validity...");
                        refreshToken(kc);
                    }, 300000); // 5 minutes
                }
            } catch (error) {
                console.error("Error during authentication process", error);
            }
        };
        
        initializeKeycloak();
        
        // Cleanup function to clear the interval when the component unmounts
        return () => {
            if (refreshIntervalRef.current !== null) {
                clearInterval(refreshIntervalRef.current);
                console.log("Token refresh interval cleared");
            }
        };
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
