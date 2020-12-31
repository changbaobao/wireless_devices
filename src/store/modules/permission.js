import router, {
    constantRoutes
} from '@/router'
import {
    generatorDynamicRouter
} from '@/router/generator-routers'

const state = {
    routes: constantRoutes,
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    GenerateRoutes({
        commit
    }) {
        return new Promise(resolve => {
            generatorDynamicRouter().then(routers => {
                commit('SET_ROUTES', routers)
                const routerList = router.options.routes
                router.selfaddRoutes([...routerList, ...routers])
                resolve(routers)
            })
        })
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}