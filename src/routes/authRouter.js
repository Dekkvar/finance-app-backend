import express from 'express';
import { AuthController } from '../controller/authController.js';

// BCRYPT for passwords
import bcrypt from 'bcrypt';

// JWT verifier MiddleWare
// import { verifyToken } from '../middlewares/verifyToken.middleware';

// Body Parser to read BODY from requests
import bodyParser from 'body-parser';

// MiddleWare to read JSON in Body
const jsonParser = bodyParser.json();

// Router from express
const authRouter = express.Router();

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
        password,
        movements: []
      };

      const controller = new AuthController;

      const response = await controller.registerUser(newUser);

      return res.status(200).send(response);

    } else {
      return res.status(400).send({
        message: '[ERROR User Data Missing]: Please enter all fields'
      });
    }
  });

export default authRouter
  // TODO: Ruta para el login
  // TODO: Ruta protegida por el Token Middleware