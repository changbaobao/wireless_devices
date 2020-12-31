import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

import VueStorage from 'vue-ls'

import config from './settings.js'

// import axios from './utils/request'
import bootstrap from './core/bootstrap'
Vue.use(VueStorage, config.storageOptions)
import moment from 'moment' //导入文件

Vue.prototype.$moment = moment; //赋值使用
Vue.use(Element, {
    size: 'small' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    created: bootstrap,
    render: h => h(App)
})