import Joi from "joi";

export const workspaceSchema = Joi.object({
    workspace_name: Joi.string().max(50).required(),
    num_cpu: Joi.number().integer().min(1).required(),
    memory: Joi.number().integer().required(),
    home_disk_size: Joi.number().integer().min(10).required(),
    github_token: Joi.string().required(),
});
