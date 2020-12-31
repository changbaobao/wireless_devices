import request from '@/utils/request'
import api from './index'
import Qs from 'qs'

// 标签查询

export function getCompanyTags(params) {
    return request({
        url: api.getTagList,
        method: 'post',
        data: Qs.stringify(params)
    })
}

/**
 * 
 * @param {标签添加} params 
 */
export function addCompanyTags(params) {
    return request({
        url: api.addTag,
        method: 'post',
        data: Qs.stringify(params)
    })
}


// /**
//  * 
//  * @param {标签修改} params 
//  */
// export function editCompanyTags(params) {
//     return request({
//         url: 'companyLabel/addCompanyLabel',
//         method: 'post',
//         data: Qs.stringify(params)
//     })
// }

/**
 * 
 * @param {标签删除} params 
 */
export function delCompanyTags(params) {
    return request({
        url: api.delTag,
        method: 'post',
        data: Qs.stringify(params)
    })
}