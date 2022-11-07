// 由于mutation是通过字符串调用的
// 使用枚举类可以避免书写错误
export const enum MutationKeys {
  LOG_OUT = "LOG_OUT",
  LOG_IN = "LOG_IN",
}
