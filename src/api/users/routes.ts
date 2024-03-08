import express from "express";
import { UserAccountAPI } from "./UserAccountAPI";

export const UserAccountRouter = express.Router();

UserAccountRouter.post("/create-user", async (req, res) => {
  const object = req.body;
  const response = await UserAccountAPI.createNewUser(object, {});
  res.send(response);
});

UserAccountRouter.get("/all-users", async (req, res) => {
  const object = req.body;
  const response = await UserAccountAPI.fetchAllUsers(object, {});
  res.send(response);
});

UserAccountRouter.get("/single-user", async (req, res) => {
  const object = req.body;
  const options = {
    params: {
      query: { ...req.query },
    },
  };
  const response = await UserAccountAPI.fetchOneUser(object, options);
  res.send(response);
});

UserAccountRouter.post("/sign-up", async (req, res) => {
  const object = req.body;
  try {
    const response = await UserAccountAPI.signUpNewUser(object, {});
    res.send(response);
  } catch (error: any) {
    if (error.code === 11000) {
      res.send({
        status: 400,
        message: "Duplicate unique key insertion",
      });
    } else {
      res.send({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
});

UserAccountRouter.get("/login", async (req, res) => {
  const object: any = req.body;
  const options: any = {};

  const response = await UserAccountAPI.loginUser(object, options);
  res.send(response);
});
