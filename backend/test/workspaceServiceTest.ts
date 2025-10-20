import workspaceServiceInstance from "../src/workspace/workspaceService";
import "dotenv/config";

console.log("Begin test");

async function test() {
    // Get Templates
    const templates = await workspaceServiceInstance.getTemplates();
    console.log(templates);

    // Get workspaces
    const workspaces = await workspaceServiceInstance.getWorkspaces("admin@example.com");
    console.log(workspaces);
}

test();
