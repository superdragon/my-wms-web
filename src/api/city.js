import request from '@/utils/request'

export function listProv() {
  return request({
    url: '/region/prov',
    method: 'post',
    requestMethod: 'form',
  })
}

export function listCity(data) {
  return request({
    url: '/region/city',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

