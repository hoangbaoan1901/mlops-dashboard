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
            console.log(`req.body.workspace_name: ${body.workspace_name}`);
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
            res.status(500).json({ error: error.message, from: "controller" });
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
            console.log(
                `Getting secret for user: ${userInfo.username}, email: ${userInfo.email}`
            );
            const coderSecret = await userServiceInstance.getUserSecret(
                userInfo.username,
                userInfo.email
            );
            console.log(
                `Coder secret retrieved: ${coderSecret ? "Yes" : "No"}`
            );
            if (!coderSecret) {
                return res.status(403).send("User secret not found");
            }

            // Use CODER_BASE_URL with fallback like in the working implementation
            const CODER_BASE_URL = process.env.CODER_BASE_URL || process.env.CODER_URL || "http://localhost:30100";
            console.log(`Using Coder base URL: ${CODER_BASE_URL}`);

            const coderAppUrl = `${CODER_BASE_URL}/@${userInfo.username}/${workspace}.main/apps/${appName}`;
            console.log(`Constructed coderAppUrl: ${coderAppUrl}`);

            // Parse domain from URL
            const coderDomain = new URL(CODER_BASE_URL).hostname;
            console.log(`Extracted coderDomain: ${coderDomain}`);

            console.log(
                `Requesting Coder session token for email: ${userInfo.email}`
            );
            const coderTokenRequest =
                await this.workspaceServiceInstance.getCoderSessionToken(
                    userInfo.email,
                    coderSecret
                );
            console.log(
                "Coder token request response:",
                JSON.stringify(coderTokenRequest)
            );

            if (!coderTokenRequest || !coderTokenRequest.session_token) {
                console.error(
                    "No session token returned from getCoderSessionToken"
                );
                return res
                    .status(500)
                    .send("Failed to obtain Coder session token");
            }

            const tokenData = coderTokenRequest.session_token;
            console.log(`Redirecting to Coder app: ${coderAppUrl}`);
            console.log(
                `Setting coder_session_token cookie for domain: ${coderDomain}`
            );
            // Log detailed information about the request and the cookie we're setting
            console.log("Request host:", req.headers.host);
            console.log("Request origin:", req.headers.origin);
            console.log("Request referer:", req.headers.referer);
            
            // Cookie options for debugging
            const cookieOptions = {
                // Test without specifying domain first
                path: "/",
                httpOnly: false,
                secure: false,
                sameSite: "lax" as "lax" | "none" | "strict",
            };
            
            console.log("Setting cookie with options:", JSON.stringify(cookieOptions));
            console.log("Token data length:", tokenData?.length || 0);
            
            // Set the cookie with logging
            res.cookie("coder_session_token", tokenData, cookieOptions);
            
            // Log all response headers being set
            console.log("Response headers:", res.getHeaders());
            
            // EXPERIMENTAL: Try setting the cookie again with different approaches
            // 1. Try setting with coderDomain
            console.log("Setting cookie with coderDomain:", coderDomain);
            res.cookie("coder_session_token_test1", tokenData.substring(0, 10), {
                domain: coderDomain,
                path: "/",
                httpOnly: false,
                secure: false,
                sameSite: "none"
            });
            
            // 2. Try with wildcard domain (for subdomains)
            const wildcardDomain = coderDomain.includes('.')
                ? `.${coderDomain.split('.').slice(-2).join('.')}`
                : coderDomain;
            console.log("Setting cookie with wildcardDomain:", wildcardDomain);
            res.cookie("coder_session_token_test2", tokenData.substring(0, 10), {
                domain: wildcardDomain,
                path: "/",
                httpOnly: false,
                secure: false,
                sameSite: "none"
            });
            
            // Return success to the frontend - we won't redirect
            res.status(200).json({ 
                success: true,
                message: "Coder session cookie set",
                url: coderAppUrl,
                token: tokenData,
                cookieDomain: coderDomain
            });
        } catch (error) {
            console.error("Error in accessWorkspaceApp endpoint:", error);
            console.error(
                "Error details:",
                JSON.stringify({
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                })
            );
            res.status(500).send(
                "Internal server error while accessing workspace app: " +
                    error.message
            );
        }
    }
}

export const workspaceController = new WorkspaceController();
