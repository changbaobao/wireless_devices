import request from '@/utils/request'
import api from './index'
import Qs from 'qs'
export function getProductData(params) {
    return request({
        url: api.ProductData,
        method: 'post',
        data: Qs.stringify(params)
    })
}
export function addProduct(params) {
    return request({
        url: api.addProduct,
        method: 'post',
        data: Qs.stringify(params)
    })
}

export function editProduct(params) {
    return request({
        url: api.editProduct,
        method: 'post',
        data: Qs.stringify(params)
    })
}
/**
 * 删除
 */

export function delProduct(params) {
    return request({
        url: api.Delproduct,
        method: 'post',
        data: Qs.stringify(params)
    })
}


/**
 * 产品功能查询
 */
export function getProductFunction(params) {
    return request({
        url: api.productFunction,
        method: 'post',
        params
    })
}


export function addProductFunction(params) {
    return request({
        url: api.addProductFunction,
        method: 'post',
        data: Qs.stringify(params)
    })
}

export function editProductFunction(params) {
    return request({
        url: api.editProductFunction,
        method: 'post',
        data: Qs.stringify(params)
    })
}
/**
 * 删除
 */


export function delProductFunction(params) {
    return request({
        url: api.delProductFunction,
        method: 'post',
        data: Qs.stringify(params)
    })
}