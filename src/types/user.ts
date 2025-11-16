import type { CognitoUserInfo } from './cognito'

export interface User extends CognitoUserInfo {
  id: number
  is_seller: boolean
  address?: string
}
