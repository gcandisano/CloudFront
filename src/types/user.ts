import type { CognitoUserInfo } from './cognito'

export interface User extends CognitoUserInfo {
  id: number
  is_seller: boolean
  address?: string
  profile_picture?: string
}

export interface UpdateUserData {
  profile_picture?: string
  address?: string
}
