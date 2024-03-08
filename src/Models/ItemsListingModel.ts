import mongoose, { Schema } from "mongoose";
export const PRODUCT_CATEGORIES = {
  LAPTOP: "laptop",
  MOBILES: "mobile",
  GRAPHICS_CARD: "graphics_card",
};

export interface IItemListing {
  displayTag: string;
  price: number;
  briefDescription: string;
  detailDescription: string;
  tags: string[];
  category: string;
  imageUrls: string[];
  isInStock: boolean;
  totalInStock: number;
  totalQuantitySold?: number;
  productRating?: number;
  ownerAccountId: string;
  createdAt: Date;
}

const ItemsListingSchema = new Schema<IItemListing>({
  displayTag: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  briefDescription: {
    type: String,
    required: true,
  },
  detailDescription: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(PRODUCT_CATEGORIES),
    required: true,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
  isInStock: {
    type: Boolean,
    required: true,
  },
  totalInStock: {
    type: Number,
    required: true,
  },
  totalQuantitySold: {
    type: Number,
    default: 0,
    required: true,
  },
  productRating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
  ownerAccountId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

ItemsListingSchema.index({ displayTag: 1 });
ItemsListingSchema.index({ tags: 1 });
ItemsListingSchema.index(
  { displayTag: 1, briefDescription: 1, detailDescription: 1 },
  { unique: true }
);

export const ItemsListingModel = mongoose.model(
  "ItemsListing",
  ItemsListingSchema,
  "ItemsListings"
);
