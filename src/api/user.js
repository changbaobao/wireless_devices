import request from '@/utils/request'
import api from './index'
import Qs from 'qs'
export function login(params) {
    return request({
        url: api.Login,
        method: 'post',
        data: Qs.stringify(params)
    })
}

export function logout() {
    return request({
        url: '/vue-admin-template/user/logout',
        method: 'post'
    })
}

/**
 * 查询用户列表
 */

export function getUserList(params) {
    return request({
        url: api.userList,
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 添加用户
 */
export function addUser(params) {
    return request({
        url: api.addUserList,
        method: 'post',
        data: Qs.stringify(params)
    })
}
/**
 * 添加用户
 */
export function editUser(params) {
    return request({
        url: api.editUserList,
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 添加用户
 */
export function delUser(params) {
    return request({
        url: api.delUserList,
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 修改密码
 */
export function updatePassword(params) {
    return request({
        url: api.updatePass,
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 重置密码
 */
export function resetPassword(params) {
    return request({
        url: api.resetPass,
        method: 'post',
        data: Qs.stringify(params)
    })
}




// 公司用户管理
/**
 * 查询
 */

export function getCompanyUser(params) {
    return request({
        url: api.companyUser,
        method: 'post',
        data: Qs.stringify(params)
    })
}


/**
 * 添加
 */
export function addCompanyUser(params) {
    return request({
        url: api.addCompanyUser,
        method: 'post',
        data: Qs.stringify(params)
    })
}


/**
 * 编辑
 */
export function editCompanyUser(params) {
    return request({
        url: api.editCompanyUser,
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 删除
 */

export function delCompanyUser(params) {
    return request({
        url: api.delCompanyUser,
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 *重置密码
 */
export function resetCompanyPassword(params) {
    return request({
        url: api.resetCompanyPassword,
        method: 'post',
        data: Qs.stringify(params)
    })
}