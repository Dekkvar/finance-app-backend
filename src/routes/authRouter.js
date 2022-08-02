import express from 'express';
import { AuthController } from '../controller/authController.js';

// BCRYPT for passwords
import bcrypt from 'bcrypt';

// JWT verifier MiddleWare
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

// Body Parser to read BODY from requests
import bodyParser from 'body-parser';

// MiddleWare to read JSON in Body
const jsonParser = bodyParser.json();

// Router from express
const authRouter = express.Router();

// Controller instance to execute methods
const controller = new AuthController();

authRouter.route('/register')
  .post(jsonParser, async (req, res) => {
    const { name, lastname, email, password } = req?.body;
    let hashedPassword = '';

    if (name && lastname && email && password) {
      hashedPassword = bcrypt.hashSync(password, 9);

      const newUser = {
        name,
        lastname,
        email,
        password: hashedPassword,
        categories: [],
        movements: []
      };

      const response = await controller.registerUser(newUser);

      return res.status(200).send(response);

    } else {
      return res.status(400).send({
        message: '[ERROR User Data Missing]: Please enter all fields'
      });
    }
  });

authRouter.route('/login')
  .post(jsonParser, async (req, res) => {
    const { email, password } = req?.body;

    if (email && password) {
      const auth = {
        email,
        password
      };

      const response = await controller.loginUser(auth);

      return res.status(200).send(response);
    } else {
      return res.status(400).send({
        message: '[ERROR User Data Missing]: User cannot be logged'
      });
    }
  });

authRouter.route('/me')
  .get(verifyToken, async (req, res) => {
    const id = req?.query?.id;

    if (id) {
      const response = await controller.userData(id);

      return res.status(200).send(response);
    } else {
      return res.status(400).send({
        message: 'You are not authorised to perform this action'
      });
    }
  });

export default authRouter