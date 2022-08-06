import express from "express";
import { UserController } from "../controller/userController.js";

// JWT Verify Middleware
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

// User verify Middleware
import { verifyUser } from "../middlewares/verifyUser.middleware.js";

// Body Parser to read BODY from requests
import bodyParser from 'body-parser';

// MiddleWare to read JSON in Body
const jsonParser = bodyParser.json();

// Router from express
const userRouter = express.Router();

// Controller instance to execute methods
const controller = new UserController();

/**
 * User's personal route
 */
userRouter.route('/me')
  .get(verifyToken, verifyUser, async (req, res) => {
    const id = req?.query?.id;

    if (id) {
      const response = await controller.getUserInfo(id);

      return res.status(200).send(response);
    } else {
      return res.status(400).send({
        message: 'You are not authorised to perform this action'
      });
    }
  })

  .put(verifyToken, verifyUser, jsonParser, async (req, res) => {
    const id = req?.query?.id;
    const data = req?.body;

    if (!data) {
      return res.status(400).send({
        message: 'Please, provide any field to update'
      });
    } else if(data.password){ // TODO: Control from frontend new password has to be different that the old one.
      let hashedPassword = bcrypt.hashSync(data.password, 9);

      data.password = hashedPassword;
    }
    
    const response = await controller.updateUser(id, data);

    return res.status(200).send(response);
  })

  .delete(verifyToken, verifyUser, async (req, res) => {
    const id = req?.query?.id;

    if (id) {
      const response = await controller.deleteUser(id);

      return res.status(200).send({message: 'User deleted successfully'})
    } else {
      return res.status(400).send({
        message: 'You are not authorised to perform this action'
      });
    }
  })

userRouter.route('/data')
  .get(verifyToken, verifyUser, async (req, res) => {
    const id = req?.query?.id;

    if (id) {
      const response = await controller.getUserData(id);

      return res.status(200).send(response);
    } else {
      return res.status(400).send({
        message: 'You are not authorised to perform this action'
      });
    }
  })

  .put(verifyToken, verifyUser, jsonParser, async (req, res) => {
    const id = req?.query?.id;
    const data = req?.body; // Object with all accounts || all categories || new or modify+old movement
    let response;

    if (data.accounts || data.categories) {
      response = await controller.updateUserData(id, data);

      return res.status(200).send(response);
    } else if (data.movements) {
      response = await controller.updateUserData(id, data); // TODO: Create another controller and function that update only the month movements.

      return res.status(200).send(response);
    } else {
      return res.status(400).send({
        message: 'You are not authorised to perform this action'
      });
    }

  })

export default userRouter