/*
 * @Description:
 * @Version: 1.0.0
 * @Author: Dragon
 * @Date: 2020-10-26 09:28:38
 * @LastEditors: Dragon
 * @LastEditTime: 2020-10-30 14:33:28
 */
export default {
  pages: [
    'pages/orderList/index',
    'pages/login/index',
    'pages/index/index',
    'pages/orderDetail/index',
    'pages/user/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    selectedColor: '#4065E0',
    color: '#D4D4D4',
    list: [
      {
        pagePath: 'pages/orderList/index',
        text: '首页',
        selectedIconPath: './static/images/tabs/index-active.png',
        iconPath: './static/images/tabs/index.png',
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        selectedIconPath: './static/images/tabs/user-active.png',
        iconPath: './static/images/tabs/user.png',
      }
    ]
  },
}
