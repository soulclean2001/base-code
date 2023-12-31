import { LoginData } from '~/features/Account/pages/Login'
import client from './client'

export class auth {
  public static loginApi = async (data: LoginData) => {
    return client.post('/api/v1/auth/authenticate', data)
  }
}

export default auth
