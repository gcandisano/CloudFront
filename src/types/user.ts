import type { CognitoUserInfo } from "./cognito"
import type { Store } from "./product"

export interface User extends CognitoUserInfo {
  is_seller: boolean
  store?: Store
}
