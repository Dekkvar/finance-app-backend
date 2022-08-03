import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET;

/**
 * Middleware to Validate an User
 * @param {*} req Original request previous middleware of validation User.
 * @param {*} res Response to validation User.
 * @param {*} next Next function to be executed.
 * @returns Errors of validation in user authentication.
 */
export const verifyUser = (req, res, next) => {
  const idToken = req.headers.sessionid;
  const idQuery = req.query.id;
  
  if (!idToken) {
    return res.status(403).send({
      authenticationError: 'No User Connected',
      message: 'Not authorised perform this action'
    });
  }

  const validateUser = bcrypt.compareSync(idQuery, idToken);

  if (!validateUser) {
    return res.status(403).send({
      authenticationError: 'User Verification Error',
      message: 'Not authorised perform this action'
    });
  }

  next();
}