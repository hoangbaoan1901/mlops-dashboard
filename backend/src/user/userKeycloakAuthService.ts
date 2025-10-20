import { createRemoteJWKSet, jwtVerify } from "jose";
import "dotenv/config";

interface KeycloakConfig {
    realm: string;
    authServerUrl: string;
    clientId: string;
    clientSecret: string; // For confidential client
}

class UserKeycloakAuthService {
    private jwksUri: string;
    private issuer: string;
    private JWKS: ReturnType<typeof createRemoteJWKSet>;

    constructor(private config: KeycloakConfig) {
        // Construct JWKS URI
        this.jwksUri = `${config.authServerUrl}/realms/${config.realm}/protocol/openid-connect/certs`;
        this.issuer = `${config.authServerUrl}/realms/${config.realm}`;

        // Create JWKS resolver
        this.JWKS = createRemoteJWKSet(new URL(this.jwksUri));
    }

    /**
     * Verify JWT token from client
     */
    async verifyToken(token: string) {
        try {
            const { payload } = await jwtVerify(token, this.JWKS, {
                issuer: this.issuer,
                audience: [this.config.clientId, "test", "account"],
            });

            return {
                valid: true,
                payload,
                userId: payload.sub,
                email: payload.email,
                roles:
                    (payload.realm_access as { roles?: string[] })?.roles || [],
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message,
            };
        }
    }

    /**
     * Extract token from Authorization header
     */
    extractBearerToken(authHeader: string): string | null {
        if (!authHeader?.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }

    /**
     *
     */
    async getUserInfo(token: string) {
        const verificationResult = await this.verifyToken(token);
        if (!verificationResult.valid) {
            throw new Error("Invalid token");
        }
        return {
            username: verificationResult.payload.preferred_username,
            email: verificationResult.payload.email,
        };
    }
}

const keycloakConfig: KeycloakConfig = {
    realm: process.env.KEYCLOAK_REALM,
    authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
};

const userKeycloakAuthServiceInstance = new UserKeycloakAuthService(
    keycloakConfig
);

export default userKeycloakAuthServiceInstance;
