const S4 = function () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
// 前端生成唯一标识的方法
export function guid() {
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}
