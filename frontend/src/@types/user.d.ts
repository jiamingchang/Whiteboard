/**
 * 用户基础信息
 */
type UserBaseInfo = {
  token?: string;
  uid: string;
  nickname: string;
  avatar: string;
};

/**
 * 用户敏感信息
 */
type UserSensitiveInfo = {
  phone: string;
  password: string;
};

/**
 * 完整用户信息
 */
type FullUserInfo = UserBaseInfo & UserSensitiveInfo;
