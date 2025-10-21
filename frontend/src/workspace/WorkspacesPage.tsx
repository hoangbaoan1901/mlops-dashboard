import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../common/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import kubernetesIcon from "../assets/kubernetes.svg";
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/Delete";
import CodeIcon from "@mui/icons-material/Code";
import RefreshIcon from "@mui/icons-material/Refresh";

// Define workspace type based on the backend response
interface Workspace {
    id: string;
    name: string;
    owner_name: string;
    owner_id: string;
    owner_avatar_url: string;
    organization_id: string;
    organization_name: string;
    template_id: string;
    template_name: string;
    template_display_name: string;
    template_icon: string;
    template_allow_user_cancel_workspace_jobs: boolean;
    template_active_version_id: string;
    template_require_active_version: boolean;
    template_use_classic_parameter_flow: boolean;
    created_at: string;
    updated_at: string;
    ttl_ms: number;
    last_used_at: string;
    deleting_at: string | null;
    dormant_at: string | null;
    outdated: boolean;
    favorite: boolean;
    health: {
        healthy: boolean;
        failing_agents: any[];
    };
    automatic_updates: string;
    allow_renames: boolean;
    next_start_at: string | null;
    is_prebuild: boolean;
    latest_build: {
        id: string;
        created_at: string;
        updated_at: string;
        workspace_id: string;
        workspace_name: string;
        workspace_owner_id: string;
        workspace_owner_name: string;
        template_version_id: string;
        template_version_name: string;
        build_number: number;
        transition: string;
        initiator_id: string;
        initiator_name: string;
        status: string;
        reason: string;
        deadline: string;
        max_deadline: string | null;
        daily_cost: number;
        has_ai_task: boolean;
        has_external_agent: boolean;
        job?: {
            id: string;
            created_at: string;
            started_at: string;
            completed_at: string;
            status: string;
            worker_id: string;
            organization_id: string;
            logs_overflowed: boolean;
            type: string;
        };
        resources?: {
            id: string;
            created_at: string;
            job_id: string;
            workspace_transition: string;
            type: string;
            name: string;
            hide: boolean;
            icon: string;
            daily_cost: number;
            agents?: {
                id: string;
                name: string;
                status: string;
                lifecycle_state: string;
                apps?: {
                    id: string;
                    slug: string;
                    display_name: string;
                    health: string;
                    url: string;
                }[];
            }[];
        }[];
    };
}

// Helper function to check cookies
function debugCookies() {
    console.log("All cookies:", document.cookie);
    // Split the cookies string and find the coder_session_token
    const cookies = document.cookie.split(";");
    const coderCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("coder_session_token=")
    );
    console.log("Found coder_session_token:", coderCookie ? "Yes" : "No");
    if (coderCookie) {
        console.log("Coder cookie:", coderCookie.trim());
    }
}

function WorkspacesPage() {
    const navigate = useNavigate();
    const { isKeycloakAuthenticated, isBackendConnected, keycloak } =
        useContext(AuthContext);
    const isAuthenticated = isKeycloakAuthenticated && isBackendConnected;

    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(
        null
    );
    const [actionInProgress, setActionInProgress] = useState<string | null>(
        null
    );

    // Function to fetch workspaces from the backend
    async function fetchWorkspaces() {
        if (isAuthenticated && keycloak && keycloak.token) {
            try {
                console.log("Fetching workspaces with token");
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/workspaces`,
                    {
                        headers: {
                            Authorization: `Bearer ${keycloak.token}`,
                        },
                    }
                );
                setWorkspaces(response.data);
                setLoading(false);
                setError(null);
            } catch (error: any) {
                console.error("Error fetching workspaces:", error);

                // Handle token expiration
                if (error.response && error.response.status === 401) {
                    console.log(
                        "Token might be expired, attempting refresh..."
                    );
                    try {
                        const refreshed = await keycloak.updateToken(30);
                        if (refreshed) {
                            console.log(
                                "Token refreshed successfully, retrying fetch"
                            );
                            // Try again with new token
                            fetchWorkspaces();
                            return;
                        } else {
                            console.log(
                                "Token still valid but authentication failed"
                            );
                            setError(
                                "Authentication error. Please try logging in again."
                            );
                        }
                    } catch (refreshError) {
                        console.error("Failed to refresh token:", refreshError);
                        setError("Session expired. Please log in again.");
                    }
                } else {
                    setError("Failed to load workspaces. Please try again.");
                }
                setLoading(false);
            }
        } else {
            console.log("Not authenticated or missing token:", {
                isAuthenticated,
                hasKeycloak: !!keycloak,
                hasToken: !!(keycloak && keycloak.token),
            });
            setError("You must be authenticated to view workspaces.");
            setLoading(false);
        }
    }

    // Function to handle workspace actions (start, stop, delete)
    async function handleWorkspaceAction(
        workspaceId: string,
        action: "start" | "stop" | "delete"
    ) {
        if (!isAuthenticated || !keycloak || !keycloak.token) {
            console.log("Cannot perform action - not authenticated");
            setError("You must be authenticated to perform this action.");
            return;
        }

        setActionInProgress(workspaceId);
        console.log(`Performing ${action} action on workspace ${workspaceId}`);

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/workspaces/build`,
                { workspace_id: workspaceId, 
                    action: action },
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );

            console.log(`${action} action successful`);
            // Refetch workspaces to update the UI
            await fetchWorkspaces();
        } catch (error: any) {
            console.error(`Error ${action}ing workspace:`, error);

            // Handle token expiration
            if (error.response && error.response.status === 401) {
                console.log(
                    "Token might be expired during action, attempting refresh..."
                );
                try {
                    const refreshed = await keycloak.updateToken(30);
                    if (refreshed) {
                        console.log(
                            "Token refreshed successfully, retrying action"
                        );
                        // Remove from in-progress to avoid UI confusion
                        setActionInProgress(null);
                        // Try again with new token
                        handleWorkspaceAction(workspaceId, action);
                        return;
                    }
                } catch (refreshError) {
                    console.error(
                        "Failed to refresh token during action:",
                        refreshError
                    );
                }
            }

            setError(`Failed to ${action} workspace. Please try again.`);
        } finally {
            setActionInProgress(null);
            setDeleteDialogOpen(false);
            setWorkspaceToDelete(null);
        }
    }

    // Function to redirect to VS Code server
    async function openVSCode(workspaceName: string) {
        if (!isAuthenticated || !keycloak || !keycloak.token) {
            setError("You must be authenticated to access the workspace.");
            return;
        }

        try {
            // Create a custom endpoint URL to authenticate and redirect
            const endpoint = `/workspaces/coderapp/${workspaceName}/code-server`;
            console.log("Making request to access code-server through backend");

            // Make an authenticated request with credentials to get cookies and response data
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                    withCredentials: true, // Important! This ensures cookies are sent with the request
                }
            );

            console.log("Response from backend:", response.data);

            // Wait a moment for cookie to be set
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Check cookies before opening the window
            console.log("Checking cookies before opening Coder:");
            debugCookies();

            // Open the Coder URL - the cookie should be included
            const coderUrl = response.data.url;
            console.log("Opening code-server at:", coderUrl);

            // Create a popup window with the Coder URL
            const coderWindow = window.open(coderUrl, "_blank");

            // Optional: Check cookies after opening
            setTimeout(() => {
                console.log("Checking cookies after opening Coder:");
                debugCookies();

                // Also check if we redirected to login page (would indicate cookie issues)
                if (coderWindow && !coderWindow.closed) {
                    try {
                        console.log(
                            "Coder window URL:",
                            coderWindow.location.href
                        );
                    } catch (e) {
                        // Cross-origin error might happen
                        console.log(
                            "Cannot access Coder window URL due to cross-origin restrictions"
                        );
                    }
                }
            }, 2000);
        } catch (error: any) {
            console.error("Error opening VS Code server:", error);

            // Handle token expiration
            if (error.response && error.response.status === 401) {
                console.log("Token might be expired, attempting refresh...");
                try {
                    const refreshed = await keycloak.updateToken(30);
                    if (refreshed) {
                        console.log(
                            "Token refreshed successfully, retrying code-server access"
                        );
                        // Try again with new token
                        openVSCode(workspaceName);
                        return;
                    }
                } catch (refreshError) {
                    console.error("Failed to refresh token:", refreshError);
                }
            }

            setError("Failed to open VS Code server. Please try again.");
        }
    }

    // Function to determine if VS Code button should be enabled
    function isVSCodeAvailable(workspace: Workspace): boolean {
        // First check if the workspace is running
        if (
            !workspace.latest_build ||
            workspace.latest_build.status !== "running"
        ) {
            return false;
        }

        // Verify resources array exists
        if (
            !workspace.latest_build.resources ||
            workspace.latest_build.resources.length === 0
        ) {
            return false;
        }

        // Look for the deployment resource which contains agents
        for (const resource of workspace.latest_build.resources) {
            // Skip resources without agents
            if (!resource.agents || resource.agents.length === 0) {
                continue;
            }

            // Check each agent
            for (const agent of resource.agents) {
                // Skip agents without apps
                if (!agent.apps || agent.apps.length === 0) {
                    continue;
                }

                // Check for healthy code-server app
                for (const app of agent.apps) {
                    if (
                        app.slug === "code-server" &&
                        app.health === "healthy"
                    ) {
                        console.log("Found healthy code-server app:", app);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // Set up polling for workspaces
    useEffect(() => {
        // Check if auth is ready before fetching
        if (isAuthenticated && keycloak) {
            console.log("Auth is ready, fetching workspaces");

            // Fetch workspaces immediately on component mount
            fetchWorkspaces();

            // Set up interval to fetch workspaces every 5 seconds
            const interval = setInterval(() => {
                fetchWorkspaces();
            }, 5000);

            // Clean up interval on component unmount
            return () => clearInterval(interval);
        } else {
            console.log("Auth not ready yet:", {
                isKeycloakAuthenticated,
                isBackendConnected,
                hasKeycloak: !!keycloak,
            });
            setLoading(true);
        }
    }, [isAuthenticated, keycloak]);

    // Debug effect for auth state changes
    useEffect(() => {
        console.log("Auth state changed:", {
            isKeycloakAuthenticated,
            isBackendConnected,
            isAuthenticated,
            hasKeycloak: !!keycloak,
            token: keycloak?.token ? "Present" : "Missing",
        });
    }, [
        isKeycloakAuthenticated,
        isBackendConnected,
        isAuthenticated,
        keycloak,
    ]);

    // Debug effect to help diagnose VS Code button availability - with less verbose logging
    useEffect(() => {
        if (workspaces.length > 0) {
            console.log(`Received ${workspaces.length} workspaces`);

            // Only log info about workspaces with code-server apps
            workspaces.forEach((workspace) => {
                const resources = workspace.latest_build.resources || [];
                let hasCodeServer = false;

                for (const resource of resources) {
                    if (!resource.agents) continue;

                    for (const agent of resource.agents) {
                        if (!agent.apps) continue;

                        for (const app of agent.apps) {
                            if (app.slug === "code-server") {
                                hasCodeServer = true;
                                console.log(
                                    `Workspace ${workspace.name} has code-server (health: ${app.health})`
                                );
                            }
                        }
                    }
                }

                if (
                    !hasCodeServer &&
                    workspace.latest_build.status === "running"
                ) {
                    console.log(
                        `Workspace ${workspace.name} is running but has no code-server app`
                    );
                }
            });
        }
    }, [workspaces]);

    // Function to get status chip color based on workspace status
    function getStatusChipColor(status: string) {
        switch (status) {
            case "running":
                return "success";
            case "starting":
            case "pending":
                return "warning";
            case "stopping":
            case "stopped":
                return "default";
            case "failed":
            case "canceled":
            case "canceling":
                return "error";
            case "deleting":
            case "deleted":
                return "secondary";
            default:
                return "default";
        }
    }

    // Confirm delete dialog
    function openDeleteDialog(workspaceId: string) {
        setWorkspaceToDelete(workspaceId);
        setDeleteDialogOpen(true);
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
            <Card elevation={3}>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                        }}
                    >
                        <Typography variant="h5">Các không gian làm việc</Typography>
                        <Box>
                            <Tooltip title="Refresh workspaces">
                                <IconButton
                                    onClick={fetchWorkspaces}
                                    sx={{ mr: 1 }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => navigate("/workspaces/new")}
                            >
                                Không gian làm việc mới
                            </Button>
                        </Box>
                    </Box>

                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 4,
                                mb: 4,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    ) : workspaces.length === 0 ? (
                        <Typography sx={{ mt: 2 }}>
                            No workspaces found. Create a new workspace to get
                            started.
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(550px, 1fr))",
                                gap: 3,
                            }}
                        >
                            {workspaces.map((workspace) => (
                                <Card variant="outlined" key={workspace.id}>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mb: 2,
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {/* Use local kubernetes icon instead of fetching from backend */}
                                                <img
                                                    src={kubernetesIcon}
                                                    alt={workspace.template_display_name || "Kubernetes Workspace"}
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        marginRight: 8,
                                                    }}
                                                />
                                                <Typography variant="h6">
                                                    {workspace.name}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={
                                                    workspace.latest_build
                                                        .status
                                                }
                                                color={
                                                    getStatusChipColor(
                                                        workspace.latest_build
                                                            .status
                                                    ) as any
                                                }
                                                size="small"
                                            />
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            sx={{ mb: 1 }}
                                        >
                                            <strong>Owner:</strong>{" "}
                                            {workspace.owner_name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ mb: 2 }}
                                        >
                                            <strong>Template:</strong>{" "}
                                            {workspace.template_display_name}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: 1,
                                            }}
                                        >
                                            <Tooltip
                                                title={
                                                    isVSCodeAvailable(workspace)
                                                        ? "Open in VS Code"
                                                        : "VS Code not available"
                                                }
                                            >
                                                <span>
                                                    <IconButton
                                                        color="primary"
                                                        disabled={
                                                            !isVSCodeAvailable(
                                                                workspace
                                                            )
                                                        }
                                                        onClick={() =>
                                                            openVSCode(
                                                                workspace.name
                                                            )
                                                        }
                                                    >
                                                        <CodeIcon />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Start workspace">
                                                <span>
                                                    <IconButton
                                                        color="success"
                                                        disabled={
                                                            workspace
                                                                .latest_build
                                                                .status !==
                                                                "stopped" ||
                                                            actionInProgress ===
                                                                workspace.id
                                                        }
                                                        onClick={() =>
                                                            handleWorkspaceAction(
                                                                workspace.id,
                                                                "start"
                                                            )
                                                        }
                                                    >
                                                        {actionInProgress ===
                                                        workspace.id ? (
                                                            <CircularProgress
                                                                size={24}
                                                            />
                                                        ) : (
                                                            <PlayArrowIcon />
                                                        )}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Stop workspace">
                                                <span>
                                                    <IconButton
                                                        color="warning"
                                                        disabled={
                                                            ![
                                                                "running",
                                                                "failed",
                                                            ].includes(
                                                                workspace
                                                                    .latest_build
                                                                    .status
                                                            ) ||
                                                            actionInProgress ===
                                                                workspace.id
                                                        }
                                                        onClick={() =>
                                                            handleWorkspaceAction(
                                                                workspace.id,
                                                                "stop"
                                                            )
                                                        }
                                                    >
                                                        <StopIcon />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Delete workspace">
                                                <IconButton
                                                    color="error"
                                                    disabled={
                                                        actionInProgress ===
                                                        workspace.id
                                                    }
                                                    onClick={() =>
                                                        openDeleteDialog(
                                                            workspace.id
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this workspace? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() =>
                            workspaceToDelete &&
                            handleWorkspaceAction(workspaceToDelete, "delete")
                        }
                        color="error"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default WorkspacesPage;
