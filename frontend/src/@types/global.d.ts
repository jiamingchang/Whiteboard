/**
 * 服务端返回JSON
 */
type ServerResJSON<T = undefined> = {
  code: Number; // 状态码
  message: string; // 提示信息
  data: T; // 自定义携带数据（可选），默认为Object类型
};
