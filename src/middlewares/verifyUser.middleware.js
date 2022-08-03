import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET;

export const verifyUser = (req, res, next) => {
  const idToken = req.headers.idToken;
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