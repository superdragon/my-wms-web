import request from '@/utils/request'

export function pageTrade(data) {
  return request({
    url: '/trade/page',
    method: 'post',
    data,
  })
}

export function addTrade(data) {
  return request({
    url: '/trade/add',
    method: 'post',
    data,
  })
}

export function getTradeDetail(data) {
  return request({
    url: '/trade/detail',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function payTrade(data) {
  return request({
    url: '/trade/pay',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function updateTradeStatus(data) {
  return request({
    url: '/trade/updateStatus',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function checkStoreTrade(data) {
  return request({
    url: '/trade/checkStore',
    method: 'post',
    data,
  })
}

export function goodsOutTrade(data) {
  return request({
    url: '/trade/goodsOut',
    method: 'post',
    data,
  })
}
