import request from '@/utils/request'
import api from './index'
import Qs from 'qs'


/**
 * 
 * @param {公司产品查询} params 
 * 
 */
export function getCompanyProduct(params) {
    return request({
        url: 'companyProduct/listCompanyProduct',
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 
 * @param {*查询不是这个公司的所有产品} params 
 */
export function getFeiCompanyProduct(params) {
    return request({
        url: 'companyProduct/listNotEqualTo',
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 
 * @param {添加公司产品中间表} params 
 */
export function addCompanyProduct(params) {
    return request({
        url: 'companyProduct/addCompanyProduct',
        method: 'post',
        data: Qs.stringify(params)
    })
}
/**
 * 
 * @param {删除公司产品中间表} params 
 */
export function delCompanyProduct(params) {
    return request({
        url: 'companyProduct/delCompanyProduct',
        method: 'post',
        data: Qs.stringify(params)
    })
}
/**
 * 
 * @param {查询公司列表} params 
 */
export function getCompanyList(params) {
    return request({
        url: 'company/listByCompany',
        method: 'post',
        data: Qs.stringify(params)
    })
}



/**
 * 
 * @param {添加公司} params 
 */
export function addCompany(params) {
    return request({
        url: 'company/addCompany',
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 
 * @param {编辑公司} params 
 */
export function editCompany(params) {
    return request({
        url: 'company/updateCompany',
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 
 * @param {删除公司} params 
 */
export function delCompany(params) {
    return request({
        url: 'company/delCompany',
        method: 'post',
        data: Qs.stringify(params)
    })
}