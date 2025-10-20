import { Request, Response } from "express";
import workspaceServiceInstance from "./workspaceService";
import userServiceInstance from "@/user/userService";
import userKeycloakAuthServiceInstance from "@/user/userKeycloakAuthService";
import { workspaceSchema } from "./workspaceValidator";

class WorkspaceController {
    private workspaceServiceInstance = workspaceServiceInstance;
    private authServiceInstance = userKeycloakAuthServiceInstance;

    // Get workspaces
    async getWorkspaces(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const userInfo = (await this.authServiceInstance.getUserInfo(
                token
            )) as { username: string; email: string };
            const workspaces =
                await this.workspaceServiceInstance.getWorkspaces(
                    userInfo.username
                );
            res.json(workspaces);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Create a new workspace
    async createWorkspace(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const userInfo = (await this.authServiceInstance.getUserInfo(
                token
            )) as { username: string; email: string };
            const body = req.body;
            await workspaceSchema.validateAsync(body);
            const newWorkspace =
                await this.workspaceServiceInstance.createWorkspace(
                    userInfo.username,
                    body.workspace_name,
                    {
                        num_cpu: body.num_cpu,
                        memory: body.memory,
                        home_disk_size: body.home_disk_size,
                        github_token: body.github_token,
                    }
                );
            res.status(201).json(newWorkspace);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Start, stop, or delete a workspace
    async buildWorkspace(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const userInfo = (await this.authServiceInstance.getUserInfo(
                token
            )) as { username: string; email: string };
            const workspaceId = req.body.workspace_id;
            const action = req.body.action as "start" | "stop" | "delete";
            await this.workspaceServiceInstance.buildWorkspace(
                workspaceId,
                action
            );
            const workspaceOwner =
                await this.workspaceServiceInstance.getWorkspaceOwnerUsername(
                    workspaceId
                );
            if (workspaceOwner !== userInfo.username) {
                res.status(403).json({
                    error: "You are not authorized to perform this action",
                });
                return;
            }
            res.status(200).json({
                message: `Workspace ${action}ed successfully`,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async accessWorkspaceApp(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            const userInfo = (await this.authServiceInstance.getUserInfo(
                token
            )) as { username: string; email: string };
            const { workspace, appName } = req.params;

            // Validate required parameters
            // NOTE: workspace is a workspace name, not ID
            if (!workspace || !appName) {
                return res
                    .status(400)
                    .send("Missing required parameters: workspace, or appName");
            }

            // Get session token and base URL from environment
            const coderSecret = await userServiceInstance.getUserSecret(
                userInfo.username,
                userInfo.email
            );
            if (!coderSecret) {
                return res.status(403).send("User secret not found");
            }
            const coderAppUrl = `${process.env.CODER_BASE_URL}/@${userInfo.username}/${workspace}.main/apps/${appName}`;
            const coderDomain = new URL(process.env.CODER_BASE_URL).hostname;
            const coderTokenRequest =
                await this.workspaceServiceInstance.getCoderSessionToken(
                    userInfo.email,
                    coderSecret
                );
            const tokenData = coderTokenRequest.session_token;
            console.log(`Redirecting to Coder app: ${coderAppUrl}`);
            console.log(
                `Setting coder_session_token cookie for domain: ${coderDomain}`
            );

            // Set the Coder session cookie
            // The cookie needs to be set for the Coder domain
            res.cookie("coder_session_token", tokenData, {
                domain: coderDomain === "localhost" ? "localhost" : coderDomain,
            });

            // Redirect to the Coder app
            res.redirect(coderAppUrl);
        } catch (error) {
            console.error("Error in accessWorkspaceApp endpoint:", error);
            res.status(500).send(
                "Internal server error while accessing workspace app"
            );
        }
    }
}

export const workspaceController = new WorkspaceController();
