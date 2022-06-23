import request from '@/utils/request'

export function findGoodsTaste() {
  return request({
    url: '/goodsTaste/find',
    method: 'post',
    requestMethod: 'form',
  })
}

export function updateGoodsTaste(data) {
  return request({
    url: '/goodsTaste/update',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function saveGoodsTaste(data) {
  return request({
    url: '/goodsTaste/save',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

