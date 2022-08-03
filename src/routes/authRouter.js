import express from 'express';
import { AuthController } from '../controller/authController.js';
import session, { Store } from 'express-session';
import cookieParser from 'cookie-parser';

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

authRouter.use(cookieParser())

// Session config from express-session
authRouter.use(session({
  secret: 'hello world',
  resave: false,
  saveUninitialized: true
}));

// Middleware for verify user
const verifyUser = (req, res, next) => {
  const user = req.session.user;
  const cookies = req.cookies;
  console.log(cookies)
  console.log(user);

  if (!user) {
    return res.status(403).send({
      authenticationError: 'No User Connected',
      message: 'Not authorised perform this action'
    });
  }

  next();
}

// Controller instance to execute methods
const controller = new AuthController();

/**
 * Register Route
 */
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
  })

/**
 * Login Route
 */
authRouter.route('/login')
  .post(jsonParser, async (req, res) => {
    const { email, password } = req?.body;

    if (email && password) {
      const auth = {
        email,
        password
      };

      const response = await controller.loginUser(auth);

      return res.status(200).send(response); // TODO: En el frontend tengo que almacenar el id en headers para poder acceder a la ruta /me
    } else {
      return res.status(400).send({
        message: '[ERROR User Data Missing]: User cannot be logged'
      });
    }
  })

/**
 * User's personal route
 */
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

/**
 * Logout route
 */
authRouter.route('/logout')
  .get(verifyToken, async (req, res, next) => {
    let id = req.sessionID;
    console.log(id);

    req.session.user = null;
    req.session.save((err) => {
      if (err) console.error(err);

      req.session.regenerate((err) => {
        if (err) console.error(err);
      })
    });

    return res.status(200).send('User disconnected');
  })

export default authRouter