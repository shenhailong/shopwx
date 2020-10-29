import Taro from '@tarojs/taro'
import { ResponseError, ResponseNeedLogin } from '@/constants/response'
// import { clear } from '@/utils/token'
import { TOKEN } from '@/constants/key'
import { BASE_URL } from '@/constants/common'

console.log(process.env)

let Fly = null
if(process.env.TARO_ENV === 'h5') {
  Fly = require('flyio/dist/npm/fly')
}else {
  Fly = require('flyio/dist/npm/wx')
}

// 全局设置
// Fly.config.timeout = 10000;
// Fly.config.baseURL = BASE_URL;

const tokenFly = new Fly
// ({
//   timeout: 10000,
//   baseURL: BASE_URL
// });
const fly = new Fly
// ({
//   timeout: 10000,
//   baseURL: BASE_URL
// });


tokenFly.config.timeout = 10000
tokenFly.config.baseURL = BASE_URL

// fly.config.timeout = 10000
fly.config.baseURL = BASE_URL
fly.config.withCredentials = true
fly.interceptors.request.use(request => {
  try{
    request.headers['Content-Type'] = "application/json"
    if (request.method && request.method.toUpperCase() === 'GET') {
      request.params._ = Date.now()
    }
  }catch(e) {
    console.log(e.errMsg || e.toString())
  }
  return Promise.resolve(request)
})

let mark = true
fly.interceptors.response.use(
  response => {
    if (response.data.code === ResponseError) {
      Taro.showToast({
        title: response.data.message,
        icon: 'none',
        duration: 2000
      })
    } else if (response.data.code === ResponseNeedLogin) {
      // 401 需要清除本地信息，进入登录 weapplogin 流程
      // 防止连续跳转
      if(mark){
        mark = false
        // clear()
        Taro.removeStorage({
          key: TOKEN
        })
        Taro.reLaunch({
          url: '/pages/login/index'
        }).then(() => {
          setTimeout(() => {
            mark = true
          }, 2000)
        })
      }
    }
    return response
  },
  error => {
    Taro.hideLoading()
    if (error.message.indexOf('timeout') !== -1) {
      Taro.showToast({
        title: '请求超时',
        icon: 'none',
        duration: 2000
      })
    } else if (error) {
      let str = '网络不给力哦，请检查网络状态'
      switch (error.status) {
      case 404:
        str = '访问地址不存在'
        break
      case 500:
        str = '访问地址出现异常'
        break
      case 502:
      case 504:
        str = '服务器不在服务区'
        break
      default:
        break
      }
      Taro.showToast({
        title: str,
        icon: 'none',
        duration: 2000
      })
    } else {
      Taro.showToast({
        title: '出现网络错误,请重试',
        icon: 'none',
        duration: 2000
      })
    }
    return Promise.reject(error)
  }
)

// 默认导出这个对象
export default {
  get(url, params) {
    let token = Taro.getStorageSync(TOKEN)
    return new Promise((resolve) => {
      fly.get({
        method: 'get',
        url: '/cnas/v1',
        params,
        headers: {
          'api-action': url,
          [TOKEN]: token ? token : ''
        },
      }).then(res => {
        resolve(res.data);
      });
    });
  },
  post(url, body) {
    let token = Taro.getStorageSync(TOKEN)
    return new Promise((resolve) => {
      fly.post({
        method: 'post',
        url: '/cnas/v1',
        body,
        headers: {
          'api-action': url,
          [TOKEN]: token ? token : ''
        }
      }).then(res => {
        resolve(res.data);
      });
    });
  }
};
