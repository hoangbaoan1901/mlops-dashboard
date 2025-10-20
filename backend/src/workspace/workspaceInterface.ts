export type buildAction = "start" | "stop" | "delete";
export interface workspaceRichParam {
    num_cpu: number;
    memory: number;
    home_disk_size: number;
    github_token: string;
}
