import express from "express";
import { ItemsListingAPI } from "./ItemsListingAPI";

export const ItemsListingRouter = express.Router();

ItemsListingRouter.get("/carousel-products", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await ItemsListingAPI.fetchCarouselProducts(
    object,
    options
  );
  res.send(apiResponse);
});

ItemsListingRouter.post("/sell-product", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await ItemsListingAPI.sellNewProduct(object, options);
  res.send(apiResponse);
});

ItemsListingRouter.get("/popular-product", async (req, res) => {});

ItemsListingRouter.get("/feature-product", async (req, res) => {});
