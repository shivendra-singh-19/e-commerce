import Joi from "joi";
import {
  IItemListing,
  ItemsListingModel,
  PRODUCT_CATEGORIES,
} from "../../Models/ItemsListingModel";
import { UserAccountModel } from "../../Models/UserAccountModelSchema";

export class ItemsListingAPI {
  /**
   * API to fetch items for carousel
   * @param object
   * @param options
   * @returns
   */
  static async fetchCarouselProducts(object: any, options: any) {
    const recentlyAddedItem = await ItemsListingModel.find({ isInStock: true })
      .select({
        displayTag: 1,
        price: 1,
        briefDescription: 1,
        imageUrls: 1,
        ownerUsername: 1,
      })
      .sort({
        createdAt: -1,
      })
      .limit(8)
      .lean()
      .exec();

    return {
      carouselLists: recentlyAddedItem,
    };
  }

  /**
   * Api to add items to be sold in a list
   * @param object
   * @param options
   * @returns
   */
  static async sellNewProduct(object: any, options: any) {
    const itemDetailsSchema = Joi.object({
      displayTag: Joi.string().required(),
      price: Joi.number().required(),
      briefDescription: Joi.string().max(150).required(),
      detailDescription: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).required(),
      category: Joi.string().required(),
      imageUrls: Joi.array().items(Joi.string()).required(),
      totalInStock: Joi.number().required(),
      ownerUsername: Joi.string().required(),
    });

    const { error, value } = itemDetailsSchema.validate(object);
    if (error) {
      return {
        status: 400,
        error,
      };
    }

    const {
      displayTag,
      price,
      briefDescription,
      detailDescription,
      tags,
      category,
      imageUrls,
      totalInStock,
    } = object;
    const itemDetails: IItemListing = {
      displayTag,
      price,
      briefDescription,
      detailDescription,
      tags,
      category,
      imageUrls,
      isInStock: totalInStock > 0,
      totalInStock,
      ownerAccountId: object?.ownerUsername,
      createdAt: new Date(),
    };

    const userProfile = await UserAccountModel.findOne({
      $or: [
        { email: object?.ownerUsername },
        { username: object?.ownerUsername },
      ],
    })
      .lean()
      .exec();

    if (!userProfile) {
      return {
        status: 404,
        message: `${object.ownerUsername} not found. Please create an account`,
      };
    }

    const existingItem = await ItemsListingModel.findOne({
      displayTag,
      briefDescription,
      detailDescription,
    }).exec();

    let item;
    if (existingItem) {
      item = await ItemsListingModel.findOneAndUpdate(
        {
          displayTag,
          briefDescription,
          detailDescription,
        },
        {
          $inc: {
            totalInStock: 1,
          },
        }
      );
    } else {
      item = await new ItemsListingModel(itemDetails).save();
    }
    return {
      message: `Your item ${displayTag} has been updated to the list`,
    };
  }
}
