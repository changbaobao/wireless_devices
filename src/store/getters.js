const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    isPop: state => state.app.isPop,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    adminPower: state => state.user.adminPower,
    name: state => state.user.name,
    permission_routes: state => state.permission.routes,

}
export default getters