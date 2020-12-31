const api = {
    Login: '/userSystem/login', // 登录
    updatePass: 'userSystem/editUserPassWord', //修改密码
    resetPass: 'userSystem/initializationPwd', //重置密码
    userList: 'userSystem/getUserSystem', //查询用户平台列表
    addUserList: 'userSystem/addUserSystem', //添加用户
    editUserList: 'userSystem/editUserSystem', //修改用户
    delUserList: 'userSystem/delUserSystem', //删除用户
    companyUser: 'userOrg/listPlatformUserOrg', //查询用户（公司）
    addCompanyUser: 'userOrg/addUserOrg', //添加用户（公司）
    editCompanyUser: 'userOrg/updateUserOrg', //修改用户（公司）
    resetCompanyPassword: 'userOrg/companyInitializationPwd', //重置密码
    delCompanyUser: 'userOrg/delUserOrg', //删除用户（公司）
    ProductData: 'product/getProduct', //产品列表
    addProduct: 'product/addProduct', //添加产品
    editProduct: 'product/editProduct', //编辑产品
    Delproduct: 'product/delProduct', //删除产品
    productFunction: 'productFunction/getProductFunction', //产品功能查询
    addProductFunction: 'productFunction/addProductFunction', //添加产品功能
    editProductFunction: 'productFunction/editProductFunction', //编辑产品功能
    delProductFunction: 'productFunction/delProductFunction', //删除产品功能
    getTagList: 'equipmentLabel/listEquipmentLabel', //查询标签
    addTag: 'equipmentLabel/addEquipmentLabel', //添加标签
    delTag: 'equipmentLabel/delEquipmentLabel', //删除标签
    getCompanyProduct: 'companyProduct/listCompanyProduct', //查询公司产品

}
export default api