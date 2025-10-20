import { useEffect, useState } from "react";
import { keycloakPromise } from "./user/Keycloak";

function App() {
    const [userProfile, setUserProfile] = useState<any>();
    const [authenticating, setAuthenticating] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const keycloak = await keycloakPromise;
                if (keycloak.authenticated) {
                    const profile = await keycloak.loadUserProfile();
                    setUserProfile(profile);
                    console.log("User is authenticated:", keycloak.token);
                } else {
                    console.log("User is not authenticated");
                }
            } catch (error) {
                console.log(error);
            } finally {
                setAuthenticating(false);
            }
        })();
    }, []);
    if (authenticating) {
        return <div>Loading...</div>;
    }
    if (userProfile == null) {
        return <div>Please log in to continue</div>;
    }

    return (
        <div>
            <h1>Welcome, {userProfile?.fullname || "User"}!</h1>
            {userProfile && (
                <div>
                    <p>Username: {userProfile.username}</p>
                    <p>Email: {userProfile.email}</p>
                    {/* Display other user info as needed */}
                </div>
            )}
        </div>
    );
}

export default App;
