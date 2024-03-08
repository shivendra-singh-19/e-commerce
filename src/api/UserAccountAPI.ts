import * as Joi from "joi";
import {
  IUserAccounts,
  UserAccountModel,
} from "../Models/UserAccountModelSchema";
import { UserAccountUtils } from "../utils/UserAccountUtils";
export class UserAccountAPI {
  /**
   * To create new user for e commerce website
   * @param object
   * @param options
   * @returns
   */
  static async createNewUser(object: any, options: any) {
    const userAccountValidationSchema = Joi.object().keys({
      email: Joi.string().email(),
      name: Joi.string().required(),
      role: Joi.string(),
      phone: Joi.string(),
      address: Joi.string(),
    });

    const { error, value } = userAccountValidationSchema.validate(object);
    if (error) {
      return {
        status: 400,
        error: error.details[0].message,
      };
    }

    const userAccountBody = {
      name: object.name,
      email: object?.email,
      role: object?.role,
      phone: object?.phone,
      address: object?.address,
      createdAt: new Date(),
    };

    const newUser = await new UserAccountModel(userAccountBody).save();
    return {
      message: "User Created",
      user: {
        _id: newUser._id,
        name: newUser.name,
      },
    };
  }

  /**
   * To fetch all users of Collections
   * @param object
   * @param options
   * @returns
   */
  static async fetchAllUsers(object: any, options: any) {
    const users = await UserAccountModel.find({}).lean().exec();
    return {
      users,
    };
  }

  /**
   * Fetch Single user with given query
   * @param object
   * @param options
   * @returns
   */
  static async fetchOneUser(object: any, options: any) {
    const { params } = options;
    const { query } = params;
    const queryValidationSchema = Joi.object({
      email: Joi.string().email(),
      name: Joi.string(),
      phone: Joi.string(),
    });

    const { error, value } = queryValidationSchema.validate(query);
    if (error) {
      return {
        status: 400,
        message: error,
      };
    }

    const user = await UserAccountModel.findOne(query).lean().exec();
    return {
      message: "User fetched successfully",
      user,
    };
  }

  /**
   * Signing up new user
   * @param object
   * @param options
   * @returns
   */
  static async signUpNewUser(object: any, options: any) {
    const signInUserDataSchema = Joi.object({
      displayName: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string(),
      phone: Joi.number().required(),
      email: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      address: Joi.string(),
      pinCode: Joi.string(),
    });

    const { error, value } = signInUserDataSchema.validate(object);
    if (error) {
      return {
        status: 400,
        error: error.details[0].message,
      };
    }

    const user: IUserAccounts = {
      name: object.displayName,
      firstName: object.firstName,
      lastName: object?.lastName,
      phone: object.phone,
      email: object.email,
      username: object.username,
      address: object?.address,
      pinCode: object?.pinCode,
    };

    const { password } = object;
    await UserAccountUtils.encryptAndSavePassword(user, password);
    const newSignee = await new UserAccountModel(user).save();
    if (newSignee._id) {
      return {
        message: `New user has been created with email ${object.email}`,
      };
    }
  }
}
