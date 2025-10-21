import { Router } from "express";
import { workspaceController } from "./workspaceController";
import authMiddleware from "@/middleware/authMiddleware";

const workspaceRouter = Router();

// Apply authentication middleware to all workspace routes
workspaceRouter.use(authMiddleware);

// Route to get all workspaces
workspaceRouter.get("/", (req, res) =>
    workspaceController.getWorkspaces(req, res)
);

// Route to create a new workspace
workspaceRouter.post("/", (req, res) =>
    workspaceController.createWorkspace(req, res)
);

// Route to build (start, stop, delete) a workspace
workspaceRouter.post("/build", (req, res) =>
    workspaceController.buildWorkspace(req, res)
);

// Route to redirect to workspace URL
workspaceRouter.get("/coderapp/:workspace/:appName", (req, res) =>
    workspaceController.accessWorkspaceApp(req, res)
);

export default workspaceRouter;
