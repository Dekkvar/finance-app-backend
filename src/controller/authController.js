import { LogError, LogSuccess, LogWarning } from '../utils/logger.js';

// ORM - Auth Collection
import { registerUser, loginUser } from '../domain/orm/auth.orm.js';

export class AuthController {
  /**
   * Controller for Register a new User
   * @param {*} user Object with name, lastname, email, password, accounts, categories and movements.
   * @returns error (because user already created), success (message of succesfully created user) or warning (if the user object don't have any property).
   */
  async registerUser(user) {
    let response;

    if (user) {
      await registerUser(user).then((r) => {
        if (r.error) {
          LogError(`[/api/auth/register] Error Creating User: ${r.error}`)
          response = r;
        } else {
          LogSuccess(`[/api/auth/register] Created User Successfully: ${user.email}`)
          response = {
            message: `User creates successfully: ${user.name} ${user.lastname}`
          }
        }
      });
    } else {
      LogWarning('[/api/auth/register] Register needs to User Schema')
      response = {
        message: 'User not Registered: Please, provide a User to create one'
      }
    }
    return response;
  }

  /**
   * Controller for Login a User.
   * @param {*} auth Object with email and password.
   * @returns Error (if error in comparison with DB password or if any field is not provided) or object with user id, new token and welcome message (if successfully login)
   */
  async loginUser(auth) {
    let response;

    if (auth) {
      const data = await loginUser(auth);

      if (!data) {
        LogError('[/api/auth/login] Invalid password');
        response = {
          error: 'Invalid password'
        }
      } else {
        LogSuccess(`[/api/auth/login] User Logged Successfully: ${data.user.email}`);
        response = {
          id: data.user._id,
          token: data.token,
          message: `Welcome, ${data.user.name} ${data.user.lastname}`
        }
      }
    } else {
      LogWarning('[/api/auth/login] Login needs email && password');
      response = {
        error: '[AUTH ERROR]: Email & Password are needed',
        message: 'Please, provide a email && password to login'
      }
    }

    return response;
  }
}