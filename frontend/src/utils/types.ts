

export interface User {
  id: number | null; // 自增id，后端创建时生成
  DeletedAt: null;
  true_name: string;
  name: string;
  password: string; // 密码
  Rooms: null;
  userAccount: string; // 账号
  // 只读属性，ts内部Data接口，用于将时间对象转换成字符串
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
