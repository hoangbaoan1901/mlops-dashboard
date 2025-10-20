import workspaceServiceInstance from "../src/workspace/workspaceService";
import "dotenv/config";

console.log("Begin test");

async function test() {
    // Get Templates
    console.log("Getting templates...");
    const templates = await workspaceServiceInstance.getTemplates();
    console.log(templates);
    console.log("================================");

    // Get workspaces
    console.log("Getting workspaces...");
    const workspaces = await workspaceServiceInstance.getWorkspaces("admin");
    console.log(workspaces);
    console.log("================================");

    // Stop a workspace
    console.log("Stopping workspace...");
    const stopWorkspaceResult = await workspaceServiceInstance.buildWorkspace(
        "493c91e9-4158-4810-9dc7-6381132d3b18",
        "stop"
    );
    console.log(stopWorkspaceResult);
    console.log("================================");

    // Start a workspace
    console.log("Starting workspace...");
    const startWorkspaceResult = await workspaceServiceInstance.buildWorkspace(
        "493c91e9-4158-4810-9dc7-6381132d3b18",
        "start"
    );
    console.log(startWorkspaceResult);
    console.log("================================");

    // create a workspace
    console.log("Creating workspace...");
    const newWorkspace = await workspaceServiceInstance.createWorkspace(
        "admin",
        "test-workspace",
        {
            num_cpu: 4,
            memory: 16,
            home_disk_size: 50,
            github_token: "lmfao",
        }
    );
    console.log({
        newWorkspace,
    });
    console.log("================================");
}

test();
