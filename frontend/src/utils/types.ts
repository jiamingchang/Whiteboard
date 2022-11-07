export interface User {
  id: number | null; // 自增id，后端创建时生成
  DeletedAt: Date | null;
  true_name: string;
  name: string;
  password: string; // 密码
  Rooms: null;
  userAccount: string; // 账号
  // 只读属性，ts内部Data接口，用于将时间对象转换成字符串
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Room {
  ID: number | null;
  DeletedAt: Date | null;
  uid: number;
  who_add: WhoAdd;
  users: null;
  read_only: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface WhoAdd {
  ID: 1;
  DeletedAt: Date | null;
  true_name: string;
  name: string;
  password: string; // 密码
  room_id: 5;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
