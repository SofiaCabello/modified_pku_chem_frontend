const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  username: state => state.user.username,
  realName: state => state.user.realName,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  id: state => state.user.id
}
export default getters
