import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET;

/**
 * Middleware to check JWT verification
 * @param {*} req Original request previous middleware of verification JWT
 * @param {*} res Response to verification JWT
 * @param {*} next Next function to be executed
 * @returns Errors of verificaton or next execution
 */
export const verifyToken = (req, res, next) => {
  const jwtToken = req.headers['x-access-token'];

  if (!jwtToken) {
    return res.status(403).send({
      authenticationError: 'Missing JWT in request',
      message: 'Not authorised to consume this endpoint'
    });
  };

  jwt.verify(jwtToken, secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        authenticationError: 'JWT verification failed',
        message: 'Failed to verify JWT token in request'
      });
    };

    next();
  });
}