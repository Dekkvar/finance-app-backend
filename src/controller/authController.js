import { LogError, LogSuccess, LogWarning } from '../utils/logger.js';

// ORM - Auth Collection
import { registerUser, loginUser } from '../domain/orm/user.orm.js';
import { deleteUser, getUserData, updateUser } from '../domain/orm/auth.orm.js';

export class AuthController {
  /**
   * Controller for Register a new User
   * @param {*} user Object with name, lastname, email, password, categories and movements.
   * @returns error (because user already created), success (message of succesfully created user) or warning (if the user object don't have any property).
   */
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
          id: data.user._id,
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

  async getUserData(id) {
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

  async updateUser(id, data) {
    let response;

    const query = await updateUser(id, data);

    if (!query) {
      response = {
        error: 'Invalid User'
      }
    }
    
    if (data.password) {
      response = {
        message: 'Password, successfully updated'
      }
    } else {
      response = query;
    }

    return response;
  }

  async deleteUser(id) {
    let response;

    if (id) {
      LogSuccess(`[/api/users] Delete User By ID: ${id}`)
      await deleteUser(id).then((r) => {
        response = {
          message: `User with id ${id} deleted successfully`
        }
      })
    } else {
      LogWarning('[/api/users] Delete User Without ID')
      response = {
        message: 'Please, provide an ID to remove from database'
      }
    }

    return response;
  }
}

// TODO: Comprobar si este paso tiene alguna utilidad real.