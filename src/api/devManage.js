import request from "@/utils/request";
import api from "./index";
import Qs from "qs";

/**
 *
 * @param {下载模板} params
 *
 */
export function exportTemplate() {
    return request({
        url: "/equipment/downEquipment",
        method: "post",
        responseType: "blob"
    });
}

/**
 *
 * @param {设备导出} params
 *
 */
export function devExport(params) {
    return request({
        url: "/equipment/exportEquipment",
        method: "get",
        params: params,
        responseType: "blob"
    });
}

// 查询公司下拉
export function getCompanyDropDown(params) {
    return request({
        url: "/companyProduct/getCompanyDropDown",
        method: "post",
        data: Qs.stringify(params)
    });
}

/**
 *
 * @param {查询设备} params
 */
export function getDevList(params) {
    return request({
        url: "equipment/getSystemEquipment",
        method: "post",
        data: Qs.stringify(params)
    });
}

/**
 *
 * @param {添加设备} params
 */
export function addDevList(params) {
    return request({
        url: "equipment/addEquipment",
        method: "post",
        data: Qs.stringify(params)
    });
}

/**
 *
 * @param {编辑设备} params
 */
export function editDevList(params) {
    return request({
        url: "equipment/editEquipment",
        method: "post",
        data: Qs.stringify(params)
    });
}

/**
 *
 * @param {删除设备} params
 */
export function delDevList(params) {
    return request({
        url: "equipment/delEquipment",
        method: "post",
        data: Qs.stringify(params)
    });
}

/**
 * 删除标签
 */
export function addTags(params) {
    return request({
        url: "equipment/addTag",
        method: "post",
        data: Qs.stringify(params)
    });
}
/**
 * 删除标签
 */
export function delTags(params) {
    return request({
        url: "equipment/delTag",
        method: "post",
        data: Qs.stringify(params)
    });
}

/**
 * 查询平台所有标签
 */
export function getAllTags(params) {
    return request({
        url: "equipmentLabel/listEquipmentLabel",
        method: "post",
        data: Qs.stringify(params)
    });
}

/**
 * 查询公司所有标签
 */
export function getAllCompanyTags(params) {
    return request({
        url: "companyLabel/getCompanyLabel",
        method: "post",
        data: Qs.stringify(params)
    });
}

/**
 * 查询历史
 *
 */
export function getDevHistory(params) {
    return request({
        url: "equipment/getEquipmentHistorys",
        method: "post",
        params
    });
}

/**
 * 单个绑定
 */
export function bindOneDev(params) {
    return request({
        url: "equipment/bindingOneEquipment",
        method: "post",
        data: Qs.stringify(params)
    });
}

/**
 *
 * @param {批量绑定} params
 */
export function bindAllDev(params) {
    return request({
        url: "equipment/bindingEquipmentList",
        method: "post",
        params,
        paramsSerializer: params => {
            return Qs.stringify(params, { indices: false });
        }
    });
}

/**
 *
 * @param {批量解绑} params
 */
export function unBindAllDev(params) {
    return request({
        url: "equipment/relieveBindingEquipment",
        method: "post",
        params,
        paramsSerializer: params => {
            return Qs.stringify(params, { indices: false });
        }
    });
}

/**
 * 批量导入
 */
export function allExport(params) {
    return request({
        url: "equipment/importEquipment",
        method: "post",
        data: params
            // responseType: 'blob'
    });
}

/**
 * 批量添加公司或平台标签
 */
export function allAddCompanyOrSystemTag(params) {
    return request({
        url: "equipment/addEquipmentTagList",
        method: "post",
        params
    });
}

/**
 * 批量查询影子
 *
 */
export function getDeviceShadow(params) {
    return request({
        url: "unitShadow/GetDeviceShadow",
        method: "post",
        params
    });
}

/**
 * 批量修改影子
 */

export function deviceEidtShadow(params) {
    return request({
        url: "unitShadow/batchUpdateDeviceShadow",
        method: "post",
        params,
        headers: {
            "Content-Type": "application/json"
        }
    });
}