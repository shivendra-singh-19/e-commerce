import * as bcrypt from "bcrypt";
import { IUserAccounts } from "../Models/UserAccountModelSchema";

export class UserAccountUtils {
  /**
   * Encrypting and saving password in userprofile
   */
  static async encryptAndSavePassword(
    userProfile: IUserAccounts,
    plainTextPassword: string
  ) {
    /**
     * Salts to increase randomness
     */
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(plainTextPassword, saltRounds);
    userProfile.passwordHash = hashedPassword;

    return userProfile;
  }
}
