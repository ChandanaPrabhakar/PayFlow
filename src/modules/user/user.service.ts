import { UserRepository } from "./user.repository.ts";
import { AppError } from "../../utils/AppError.ts";

const userRepository = new UserRepository();

export class UserService {
  async userRegistration(email: string) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    return userRepository.createUser(email);
  }

  async getUserProfile(userId: string) {
    const userProfile = await userRepository.findById(userId);

    if (!userProfile) {
      throw new AppError("User does not exist", 404);
    }
    return userProfile;
  }
}
