import prismaClientInstance from "@/prisma/prismaClient";
import { randomBytes } from "crypto";
import workspaceServiceInstance from "@/workspace/workspaceService";

import "dotenv/config";

class UserService {
    private userSecretLength = 16;

    async createUser(username: string, email: string) {
        // Generate a random hex string for secret
        const byteLength = Math.ceil(
            this.userSecretLength % 2 === 0
                ? this.userSecretLength
                : this.userSecretLength - 1
        );
        const secret = randomBytes(byteLength)
            .toString("hex")
            .substring(0, this.userSecretLength);
        try {
            // Since prisma follows camelCase for models,
            // we might need to rename our models later
            const user = await prismaClientInstance.user.create({
                data: {
                    username: `${username}`,
                    email: `${email}`,
                    secret: secret,
                },
            });
            const workspace =
                await workspaceServiceInstance.createWorkspaceUser(
                    email,
                    username,
                    secret
                );
            return {
                user_id: user.id,
            };
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async deleteUser(username: string | null, email: string | null) {
        try {
            if (username !== null) {
                await prismaClientInstance.user.delete({
                    where: {
                        username: username,
                    },
                });
            } else {
                if (email !== null) {
                    await prismaClientInstance.user.delete({
                        where: {
                            email: email,
                        },
                    });
                } else {
                    throw new Error(
                        "Either username or email must be provided"
                    );
                }
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async getUserSecret(username: string | null, email: string | null) {
        try {
            const user = await prismaClientInstance.user.findFirst({
                where: {
                    OR: [{ username: username }, { email: email }],
                },
            });
            return user?.secret || null;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    async getOrCreateUser(username: string | null, email: string | null) {
        try {
            const user = await prismaClientInstance.user.findFirst({
                where: {
                    OR: [{ username: username }, { email: email }],
                },
            });
            if (user !== null) {
                return {
                    user_id: user.id,
                };
            } else {
                const newUser = await this.createUser(username, email);
                return {
                    user_id: newUser.user_id,
                };
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
}

const userServiceInstance = new UserService();

export default userServiceInstance;
