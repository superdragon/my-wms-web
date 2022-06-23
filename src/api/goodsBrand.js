import request from '@/utils/request'

export function findGoodsBrand(data) {
  return request({
    url: '/goodsBrand/find',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function updateGoodsBrand(data) {
  return request({
    url: '/goodsBrand/update',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function saveGoodsBrand(data) {
  return request({
    url: '/goodsBrand/save',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

