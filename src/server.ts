import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import userRouter from "./modules/user/user.router.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use("/api/user", userRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`);
});
