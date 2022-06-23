import request from '@/utils/request'

export function saveGoods(data) {
  return request({
    url: '/goods/save',
    method: 'post',
    data,
  })
}

export function updateGoods(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data,
  })
}

export function updateGoodsStatus(data) {
  return request({
    url: '/goods/updateStatus',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function findGoods(data) {
  return request({
    url: '/goods/page',
    method: 'post',
    data,
  })
}

export function getGoods(data) {
  return request({
    url: '/goods/get',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function listGoods(data) {
  return request({
    url: '/goods/list',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}
