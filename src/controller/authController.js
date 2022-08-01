import { LogError, LogSuccess, LogWarning } from '../utils/logger.js';

// ORM - Auth Collection
import { registerUser } from '../domain/orm/user.orm.js';

export class AuthController {
  async registerUser(user) {
    let response = '';

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
}

// TODO: Comprobar si este paso tiene alguna utilidad real.