import { Router } from "express";
import {
  userRegistrationController,
  getUserProfileController,
} from "./user.controller.ts";

import { validate } from "../../middlewares/validation.ts";
import { userRegistrationSchema } from "./user.validation.ts";

const userRouter = Router();

userRouter.post(
  "/registration",
  validate(userRegistrationSchema),
  userRegistrationController,
);
userRouter.get("/:userId", getUserProfileController);

export default userRouter;
