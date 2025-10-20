import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./user/userRouter";
import workspaceRouter from "./workspace/workspaceRouter";

const app = express();

// Enable CORS
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);
app.options("/", cors());

// Routers
app.use("/users", userRouter);
app.use("/workspaces", workspaceRouter);

app.get("/", (req, res) => {
    res.send("MLOps Dashboard Backend is running");
});
app.listen(3000, function () {
    console.log("App listening on port 3000");
});
