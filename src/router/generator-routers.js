// eslint-disable-next-line
import * as loginService from "@/api/user";
// eslint-disable-next-line
import Vue from "vue";
import Layout from "@/layout";

const adminRoutes = [{
        path: "/devManage",
        component: Layout,
        redirect: "/devManage/index",
        children: [{
                path: "index",
                component: () =>
                    import ("@/views/devManage/index"),
                name: "dev",
                meta: {
                    title: "设备管理",
                    icon: "datacenter"
                }
            },
            {
                path: "devAttribute",
                // path: "devAttribute/:productCode/:companyCode/:SN/:date",
                component: () =>
                    import ("@/views/devAttribute/index"),
                name: "devAttribute",
                meta: {
                    title: "设备属性",
                    icon: "datacenter"
                },
                hidden: true
            }
        ]
    },

    {
        path: "/productManage",
        component: Layout,
        redirect: "/productManage/product",
        children: [{
                path: "product",
                name: "product",
                component: () =>
                    import ("@/views/productManage/index"),
                meta: {
                    title: "产品管理",
                    icon: "application"
                }
            },
            {
                path: "function/:name/:id",
                name: "function",
                component: () =>
                    import ("@/views/productFunction/index"),
                meta: {
                    title: "产品功能",
                    icon: "dashboard"
                },
                hidden: true
            }
        ]
    },
    {
        path: "/tagManage",
        component: Layout,
        redirect: "/tagManage/index",
        meta: {
            title: "标签管理",
            icon: "dashboard"
        },
        children: [{
            path: "index",
            component: () =>
                import ("@/views/tagManage/index"),
            name: "tag",
            meta: {
                title: "标签管理",
                icon: ""
            }
        }]
    },
    {
        path: "/companyManage",
        component: Layout,
        redirect: "/companyManage/index",
        children: [{
            path: "index",
            name: "company",
            component: () =>
                import ("@/views/companyManage/index.vue"),
            meta: {
                title: "公司管理",
                icon: "company"
            }
        }]
    },
    // {
    //     path: '/demo',
    //     component: Layout,
    //     redirect: '/demo/index',
    //     children: [{
    //         path: 'index',
    //         name: 'demo',
    //         component: () =>
    //             import ('@/views/demo/index.vue'),
    //         meta: {
    //             title: 'demo管理',
    //             icon: '公司'
    //         }
    //     }]
    // },
    {
        path: "/userManage",
        component: Layout,
        redirect: "/userManage/user",
        meta: {
            title: "用户管理",
            icon: "user"
        },
        children: [{
                path: "user",
                component: () =>
                    import ("@/views/userManage/index"),
                name: "user",
                meta: {
                    title: "用户（平台）",
                    icon: ""
                }
            },
            {
                path: "userCompany",
                component: () =>
                    import ("@/views/userCompanyManage/index"),
                name: "userCompany",
                meta: {
                    title: "用户（公司）",
                    icon: ""
                }
            }
        ]
    }
];

const generalRoutes = [{
        path: "/devManage",
        component: Layout,
        redirect: "/devManage/index",
        children: [{
            path: "index",
            component: () =>
                import ("@/views/devManage/index"),
            name: "dev",
            meta: {
                title: "设备管理",
                icon: "datacenter"
            }
        }]
    },
    {
        path: "/userManage",
        component: Layout,
        redirect: "/userManage/userCompany",
        children: [{
            path: "userCompany",
            component: () =>
                import ("@/views/userCompanyManage/index"),
            name: "userCompany",
            meta: {
                title: "用户管理",
                icon: "user"
            }
        }]
    }
];
/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
    return new Promise((resolve, reject) => {
        const isAdmin = Vue.ls.get("adminPower");
        if (isAdmin == 1) {
            //管理员
            resolve(adminRoutes);
        } else {
            //普通用户
            resolve(generalRoutes);
        }
    }).catch(err => {
        reject(err);
    });
};