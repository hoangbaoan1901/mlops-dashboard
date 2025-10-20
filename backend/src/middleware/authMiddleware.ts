import { Request, Response } from "express";

export default async function authMiddleware(
    req: Request,
    res: Response,
    next: Function
) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res
                .status(401)
                .json({ message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    next();
}
