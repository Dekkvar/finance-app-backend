import { LogError, LogSuccess, LogWarning } from '../utils/logger.js';

// ORM - User Collection
import { getUserInfo, getUserData, updateUser, deleteUser, updateUserData } from '../domain/orm/user.orm.js';

export class UserController {
  /**
   * Controller to get personal user data.
   * @param {*} id of the user.
   * @returns Error (if the id dont match with any user in DB) or user data object (if successfully match in DB)
   */
  async getUserInfo(id) {
    let response;

    const data = await getUserInfo(id);

    if (!data) {
      LogWarning('[/api/user/me] Need to provide valid user to get any data')
      response = {
        error: 'Invalid User'
      }
    } else {
      LogSuccess('[/api/user/me] Data get successfully')
      response = data;
    }

    return response;
  }

  /**
   * Controller to Get Dashboard User Data.
   * @param {*} id 
   * @returns 
   */
  async getUserData(id) {
    let response;

    const data = await getUserData(id);

    if (!data) {
      LogWarning('[/api/user/me] Need to provide valid user to get any data')
      response = {
        error: 'Invalid User'
      }
    } else {
      LogSuccess('[/api/user/me] Data get successfully')
      response = data;
    }

    return response; 
  }
  
  /**
   * Controller to update personal User data.
   * @param {*} id 
   * @param {*} data 
   * @returns 
   */
  async updateUser(id, data) {
    let response;

    const query = await updateUser(id, data);

    if (!query) {
      LogWarning('[/api/user/me] Need to provide valid user to update any data')
      response = {
        error: 'Invalid User'
      }
    } else if (data.password) {
      LogSuccess('[/api/user/me] Password successfully updated')
      response = {
        message: 'Password, successfully updated'
      }
    } else {
      LogSuccess('[/api/user/me] User data successfully updated')
      response = query;
    }

    return response;
  }

  /**
   * Controller to update personal User data.
   * @param {*} id 
   * @param {*} data 
   * @returns 
   */
  async updateUserData(id, data) {
    let response;

    const query = await updateUserData(id, data);

    if (!query) {
      LogWarning('[/api/user/data] Need to provide valid user to update any data')
      response = {
        error: 'Invalid User'
      }
    } else if (data.password) {
      LogSuccess('[/api/user/data] Password successfully updated')
      response = {
        message: 'Password, successfully updated'
      }
    } else {
      LogSuccess('[/api/user/data] User data successfully updated')
      response = query;
    }

    return response;
  }

  /**
   * Controller to delete an User.
   * @param {*} id 
   * @returns 
   */
  async deleteUser(id) {
    let response;

    if (id) {
      LogSuccess(`[/api/user/me] Delete User By ID: ${id}`)
      await deleteUser(id).then((r) => {
        response = {
          message: `User with id ${id} deleted successfully`
        }
      })
    } else {
      LogWarning('[/api/user/me] Delete User Without ID')
      response = {
        message: 'Please, provide an ID to remove from database'
      }
    }

    return response;
  }
}