import { Router } from "express";
import authMiddleware from "@/middleware/authMiddleware";
import { userController } from "./userController";

const userRouter = Router();

// Apply authentication middleware to all user routes
userRouter.use(authMiddleware);

// Get or create user profile
userRouter.get("/", (req, res) => userController.getOrCreateUser(req, res));

export default userRouter;