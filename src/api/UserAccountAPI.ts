import * as Joi from 'joi';
import { USER_ROLES, UserAccountModel } from '../Models/UserAccountModelSchema';
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
            address: Joi.string()
        });

        const { error, value } = userAccountValidationSchema.validate(object);
        if (error) {
            return {
                status: 400,
                error: error.details[0].message
            }
        }

        const userAccountBody = {
            name: object.name,
            email: object?.email,
            role: object?.role,
            phone: object?.phone,
            address: object?.address,
            createdAt: new Date()
        };

        const newUser = await new UserAccountModel(userAccountBody).save();
        return {
            message: "User Created",
            user: {
                _id: newUser._id,
                name: newUser.name
            }
        }
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
            users
        }

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
            phone: Joi.string()
        })

        const { error, value } = queryValidationSchema.validate(query);
        if(error){
            return {
                status: 400,
                message: error
            }
        }

        const user = await UserAccountModel.findOne(query).lean().exec();
        return {
            message: "User fetched successfully",
            user
        }
    }
}