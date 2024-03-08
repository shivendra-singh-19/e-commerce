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
    bcrypt.genSalt(saltRounds, async (err, salt) => {
      if (err) {
        console.error();
      }

      bcrypt.hash(plainTextPassword, salt, (err, hash) => {
        if (err) {
          console.error(err);
        }

        userProfile["passwordHash"] = hash;
      });
    });
  }
}
