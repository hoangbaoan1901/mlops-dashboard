import userKeycloakAuthServiceInstance from "./userKeycloakAuthService";
import userServiceInstance from "./userService";
import { Request, Response } from "express";

class UserController {
    private serviceInstance = userServiceInstance;
    private authServiceInstance = userKeycloakAuthServiceInstance;

    /**
     * Extract user info from Keycloak token
     * GET /api/users/me
     */
    async getOrCreateUser(req: Request, res: Response) {
        try {
            // Assuming the token is available in req.headers.authorization
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const userInfo = (await this.authServiceInstance.getUserInfo(
                token
            )) as { username: string; email: string };
            const result = await this.serviceInstance.getOrCreateUser(
                userInfo.username,
                userInfo.email
            );
            res.json(result);
        } catch (errors) {
            res.status(500).json({ error: errors.message });
        }
    }
}

export const userController = new UserController();
