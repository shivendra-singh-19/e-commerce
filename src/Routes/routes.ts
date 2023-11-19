import express from 'express';
import { UserAccountAPI } from '../api/UserAccountAPI';

export const UserAccountRouter = express.Router();

UserAccountRouter.post('/create-user', async (req, res) => {
    const object = req.body;
    const response = await UserAccountAPI.createNewUser(object, {});
    res.send(response);
});

UserAccountRouter.get('/all-users', async (req, res) => {
    const object = req.body;
    const response = await UserAccountAPI.fetchAllUsers(object, {});
    res.send(response);
})

UserAccountRouter.get('/single-user', async (req, res) => {
    const object = req.body;
    const options = {
        params: {
            query : {...req.query}
        }
    };
    const response = await UserAccountAPI.fetchOneUser(object, options);
    res.send(response);
})