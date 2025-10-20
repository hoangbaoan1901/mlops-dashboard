# Workspace routes

- GET: `/workspaces`: Return the list of workspaces (A List[] of workspaces, each wrapped in a JSON object)

- POST: `/workspaces`:  Create a new workspace  
    Request body:
  - workspace_name (string)
  - num_cpu (int)
  - memory (int)
  - home_disk_size (int)
  - github_token (string)

- POST: `/workspaces/build`: Create a new workspace build (for start, stop and delete a workspace)  
    Request body:
  - workspace_id (string): workspace ID
  - action: start | stop | delete
