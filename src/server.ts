import express from "express";
import "dotenv/config";
import userRouter from "./modules/user/user.router.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import transactionRouter from "./modules/transaction/transaction.router.ts";
import webhookRouter from "./modules/webhook/webhook.router.ts";

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use("/webhook", express.raw({ type: "application/json" }), webhookRouter);
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`);
});
