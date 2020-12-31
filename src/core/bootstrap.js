import Vue from 'vue'
import store from '@/store/index'

export default function Initializer() {
    store.commit('user/SET_NAME', Vue.ls.get('name'))
    store.commit('user/SET_ADMIN', Vue.ls.get('adminPower'))
}