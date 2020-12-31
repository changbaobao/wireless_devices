/*
 * @Author: your name
 * @Date: 2020-02-07 14:32:52
 * @LastEditTime: 2020-02-20 15:05:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \microUI-use-x\vue-admin-template-master\src\utils\request.js
 */
import axios from 'axios'
import Vue from 'vue'
import {
    Message
} from 'element-ui'
import store from '@/store'
import {
    getToken
} from '@/utils/auth'
import Router from 'vue-router'
import router from '@/router'

// console.log(Router.prototype)

Vue.use(Router)

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 200000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        if (store.getters.token) {
            config.headers['token'] = getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        if (store.getters.isPop) {
            return response
        }
        if (!res.success) {

            Message({
                message: res.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            if (res.msg == '无效的token信息') {
                store.dispatch('user/logout').then(() => {
                    router.push('/login')
                    location.reload()
                })
            }
            Promise.reject(new Error(res.mes || 'Error'))
            return res
        } else {
            return res
        }

        // if the custom code is not 20000, it is judged as an error.
    },
    error => {
        return Promise.reject(error)
    }
)

export default service