import { LogError, LogSuccess, LogWarning } from '../utils/logger.js';

// ORM - Auth Collection
import { registerUser, loginUser, getUserData } from '../domain/orm/user.orm.js';

export class AuthController {
  async registerUser(user) {
    let response;

    if (user) {
      await registerUser(user).then((r) => {
        if (r.message) {
          LogError(`[/api/auth/register] Error Creating User: ${r.message}`)
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

  async loginUser(auth) {
    let response;

    if (auth) {
      const data = await loginUser(auth);

      if (!data) {
        response = {
          error: 'Invalid password'
        }
      } else {
        LogSuccess(`[/api/auth/login] User Logged Successfully: ${data.user.email}`)
        response = {
          token: data.token,
          message: `Welcome, ${data.user.name} ${data.user.lastname}`
        }
      }
    } else {
      LogWarning('[/api/auth/login] Login needs email && password')
      response = {
        error: '[AUTH ERROR]: Email & Password are needed',
        message: 'Please, provide a email && password to login'
      }
    }

    return response;
  }

  async userData(id) {
    let response;

    const data = await getUserData(id);

    if (!data) {
      response = {
        error: 'Invalid User'
      }
    } else {
      response = data;
    }

    return response;
  }
}

// TODO: Comprobar si este paso tiene alguna utilidad real.