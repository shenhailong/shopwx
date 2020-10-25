/**
 * @返回值
 * @ 失败
 * 0 成功
 * 80001 未绑定账号
 * 403 需登录
 * 2 特殊逻辑
 * 3 特殊逻辑
 * 可根据需要继续添加
 */
// 返回成功
export const ResponseSuccess = '1'
// 返回失败
export const ResponseError = '0'
// 需要登录
export const ResponseNeedLogin = '401'
// 未绑定账号
export const ResponseNoBind = '80001'
// 手机号尚未开通账号
export const ResponseNoOpen = '80002'

