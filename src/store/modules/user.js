import Vue from 'vue'
import {
    login
} from '@/api/user'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import router, {
    resetRouter
} from '@/router'
// const isAdmin = Vue.ls.get('adminPower', '')

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    adminPower: ''
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        Vue.ls.set('name', name)
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ADMIN: (state, adminPower) => {
        Vue.ls.set('adminPower', adminPower)
        state.adminPower = adminPower
    },
}

const actions = {
    // user login
    login({
        commit
    }, userInfo) {
        const {
            emailTel,
            password
        } = userInfo
        return new Promise((resolve, reject) => {
            login({
                emailTel,
                password
            }).then(response => {
                const {
                    data
                } = response
                commit('SET_TOKEN', data.token)
                commit('SET_NAME', data.name)
                commit('SET_ADMIN', data.adminPower)
                setToken(data.token)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({
        commit,
        state,
        dispatch
    }) {
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', '')
            commit('SET_NAME', '')
            commit('SET_ADMIN', '')
            Vue.ls.clear()
            sessionStorage.clear()
            removeToken()
            resetRouter()
            resolve()
        })
    },
    // remove token
    resetToken({
        commit
    }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_NAME', [])
            removeToken()
            resolve()
        })
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}