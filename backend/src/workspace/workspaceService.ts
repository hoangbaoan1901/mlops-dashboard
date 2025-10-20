import axios from "axios";
import "dotenv/config";
import {
    buildAction,
    workspaceRichParam,
} from "@/workspace/workspaceInterface";

class workspaceService {
    /**
     * Every function in this service relies on axios call
     * Every action will be done using administrator token
     */
    static coderURL = `${process.env.CODER_URL}/api/v2`;
    private adminEmail: string;
    private adminPassword: string;
    private adminToken: string;
    private tokenExpiresAt: Date | null = null;
    private refreshPromise: Promise<void> | null = null;

    constructor() {
        this.adminEmail = process.env.CODER_ADMIN_EMAIL;
        this.adminPassword = process.env.CODER_ADMIN_PASSWORD;
    }

    /**
     *
     * @param email user's email
     * @param password user's password
     * @returns coder session token in JSON format
     */
    async getCoderSessionToken(email: string, password: string) {
        const payload = { email: email, password: password };
        const endpoint = "/users/login";
        try {
            const sessionToken = await axios.post(
                `${workspaceService.coderURL}${endpoint}`,
                payload, // Data as second parameter
                {
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            const expiresInSeconds = sessionToken.data.expires_in || 3600 * 24;
            this.tokenExpiresAt = new Date(
                Date.now() + (expiresInSeconds - 60) * 1000
            );
            return sessionToken.data;
        } catch (error) {
            console.log(workspaceService.coderURL);
            console.log(`Error getting coder session token: ${error.message}`);
            this.adminToken = null;
            this.tokenExpiresAt = null;
            throw error;
        }
    }

    /**
     * Sometimes, session tokens might gone out, so refresh it.
     * Besides, we'll have to run it on construction.
     */
    async refreshAdminToken() {
        try {
            const tokenRequest = await this.getCoderSessionToken(
                this.adminEmail,
                this.adminPassword
            );
            this.adminToken = tokenRequest.session_token;
            console.log(`Admin Token: ${this.adminToken}`);
        } catch (error) {
            console.log(error.message);
            this.adminToken = null;
            this.tokenExpiresAt = null;
            throw error;
        }
    }

    private async ensureValidAdminToken(): Promise<void> {
        const isTokenExpired =
            !this.tokenExpiresAt || this.tokenExpiresAt <= new Date();
        if (isTokenExpired) {
            if (!this.refreshPromise) {
                this.refreshPromise = this.refreshAdminToken().finally(() => {
                    this.refreshPromise = null;
                });
            }
            await this.refreshPromise;
        }
    }

    async intialize() {
        try {
            await this.refreshAdminToken();
            console.log("Workspace service initialized successfully");
            return true;
        } catch (error) {
            console.error("Failed to initialize workspace service:", error);
            throw error; // Re-throw to let the caller know initialization failed
        }
    }

    async getTemplates() {
        const endpoint = "/templates";
        // Ensure token is available
        await this.ensureValidAdminToken();
        try {
            const templatesRequest = await axios.get(
                `${workspaceService.coderURL}${endpoint}`,
                {
                    headers: {
                        accept: "application/json",
                        "Coder-Session-Token": this.adminToken,
                    },
                }
            );
            let templatesData = templatesRequest.data;
            return templatesData;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async getLatestTemplateID() {
        // Ensure token is available
        await this.ensureValidAdminToken();
        try {
            const templates = await this.getTemplates();
            const templateLength = templates.length;
            if (templateLength === 0) {
                throw new Error("There're currently no available templates");
            }
            return templates[templateLength - 1].id;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async getLatestTemplateActiveID() {
        try {
            const templates = await this.getTemplates();
            const templateLength = templates.length;
            if (templateLength === 0) {
                throw new Error("There're currently no available templates");
            }
            return templates[templateLength - 1];
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    /**
     * Get all user's workspaces.
     */
    async getWorkspaces(username: string) {
        console.log(this.adminToken);
        // Ensure token is available
        await this.ensureValidAdminToken();
        const endpoint = "/workspaces";
        const query = `owner:${username}`;
        try {
            const workspacesResponse = await axios.get(
                `${workspaceService.coderURL}${endpoint}`,
                {
                    params: { q: query },
                    headers: {
                        accept: "application/json",
                        "Coder-Session-Token": this.adminToken,
                    },
                }
            );
            return workspacesResponse.data.workspaces;
        } catch (error) {
            console.error("Error fetching workspaces:", error);
            throw new Error("Failed to fetch workspaces");
        }
    }

    /**
     * This function retrieves metadata on workspace,
     * currently, main use case is to check workspace owner
     */
    async getWorkspaceMetadata(workspaceID: string) {
        // Ensure token is available
        await this.ensureValidAdminToken();
        const endpoint = `/workspaces/${workspaceID}`;
        try {
            const workspaceData = await axios.get(
                `${workspaceService.coderURL}${endpoint}`,
                {
                    headers: {
                        accept: "application/json",
                        "Coder-Session-Token": this.adminToken,
                    },
                }
            );
            return workspaceData.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Workspace not found");
            }
            console.error("Error fetching workspace metadata:", error);
            throw new Error("Failed to fetch workspace metadata");
        }
    }

    /**
     *
     */
    async getWorkspaceOwnerUsername(workspaceID: string) {
        // Ensure token is available
        await this.ensureValidAdminToken();
        try {
            const workspaceMetadata = await this.getWorkspaceMetadata(
                workspaceID
            );
            const workspaceOwnerUsername = workspaceMetadata.owner_name;
            return workspaceOwnerUsername;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    /**
     * This one is for starting, stopping and deleting a workspace.
     */
    async buildWorkspace(workspaceID: string, action: buildAction) {
        // Ensure token is available
        await this.ensureValidAdminToken();
        const endpoint = `/workspaces/${workspaceID}/builds`;
        try {
            const buildResponse = await axios.post(
                `${workspaceService.coderURL}${endpoint}`,
                {
                    transition: action,
                },
                {
                    headers: {
                        accept: "application/json",
                        "Coder-Session-Token": this.adminToken,
                        "Content-Type": "application/json",
                    },
                }
            );
            return buildResponse.data;
        } catch (error) {
            if (error.response?.status === 404) {
                // console.log(error.message);
                throw new Error("Workspace not found");
            }
            console.error(
                `Error ${action}ing workspace:`,
                error.response.data.message
            );
            throw new Error(
                `Failed to ${action} workspace, ${error.response.data.message}`
            );
        }
    }

    async getWorkspaceTiming(workspaceID: string) {
        await this.ensureValidAdminToken();
        const endpoint = `/workspaces/${workspaceID}/timings`;
        try {
            const workspaceTiming = await axios.get(
                `${workspaceService.coderURL}${endpoint}`,
                {
                    headers: {
                        accept: "application/json",
                        "Coder-Session-Token": this.adminToken,
                    },
                }
            );
            return workspaceTiming.data.agent_script_timings;
        } catch (error) {
            console.error("Error fetching workspace timing:", error);
            throw new Error(
                `Failed to fetch workspace timing: ${error.response.data.message}`
            );
        }
    }

    async createWorkspace(
        username: string,
        workspaceName: string,
        richParameter: workspaceRichParam
    ) {
        // Ensure token is available
        await this.ensureValidAdminToken();
        const endpoint = `/users/${username}/workspaces`;
        try {
            const templateID = await this.getLatestTemplateID();

            const createResponse = await axios.post(
                `${workspaceService.coderURL}${endpoint}`,
                {
                    automatic_updates: "never",
                    name: workspaceName,
                    rich_parameter_values: [
                        {
                            name: "cpu",
                            value: `${richParameter.num_cpu}`,
                        },
                        {
                            name: "github_token",
                            value: `${richParameter.github_token}`,
                        },
                        {
                            name: "home_disk_size",
                            value: `${richParameter.home_disk_size}`,
                        },
                        {
                            name: "memory",
                            value: `${richParameter.memory}`,
                        },
                    ],
                    template_id: templateID,
                    ttl_ms: null,
                },
                {
                    headers: {
                        accept: "application/json",
                        "Coder-Session-Token": this.adminToken,
                        "Content-Type": "application/json",
                    },
                }
            );
            return createResponse.data;
        } catch (error) {
            console.error("Error creating workspace:", error);
            throw new Error("Failed to create workspace");
        }
    }

    async createWorkspaceUser(
        email: string,
        username: string,
        password: string
    ) {
        // Ensure token is available
        await this.ensureValidAdminToken();
        const endpoint = `/users`;
        try {
            const createUserRequest = await axios.post(
                `${workspaceService.coderURL}${endpoint}`,
                {
                    email: `${email}`,
                    login_type: "password",
                    organization_ids: ["00000000-0000-0000-0000-000000000000"],
                    name: `${username}`,
                    password: `${password}`,
                    username: `${username}`,
                },
                {
                    headers: {
                        accept: "application/json",
                        "Coder-Session-Token": this.adminToken,
                    },
                }
            );
            return createUserRequest.data;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
}

// Create the instance
const workspaceServiceInstance = new workspaceService();

// Initialize the token (IIFE - Immediately Invoked Function Expression)
// (async () => {
//     try {
//         await workspaceServiceInstance.refreshAdminToken();
//         console.log("Workspace service initialized successfully");
//     } catch (error) {
//         console.error("Failed to initialize workspace service:", error);
//     }
// })();

// Export the singleton instance
export default workspaceServiceInstance;
