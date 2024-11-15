export default {
  getResourceList (params) {
    return request({
      url: '/api/resources',
      method: 'post',
      data: params
    })
  }
}
