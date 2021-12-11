import axios from 'axios'

const instance = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // JWT 认证
    console.log('请求拦截器 成功')
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      //接口请求失败，具体根据实际情况判断
      return Promise.reject('状态码错误') //接口Promise返回错误状态
    }
    return Promise.resolve(response.data)
  },
  (error) => {
    if (axios.isCancel(error)) {
      throw new axios.Cancel('cancel request')
    } else {
      console.log('请求错误')
    }
    return Promise.reject(error)
  },
)

export default instance
