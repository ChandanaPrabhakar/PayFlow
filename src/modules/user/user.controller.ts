import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.ts";

const userService = new UserService();

export const userRegistrationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const user = await userService.userRegistration(email as string);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const userProfile = await userService.getUserProfile(userId as string);

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: userProfile,
    });
  } catch (error: any) {
    next(error);
  }
};
