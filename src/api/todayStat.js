import request from '@/utils/request'

export function todayStatTotal() {
  return request({
    url: '/todayStat/total',
    method: 'get',
  })
}

export function todayLatestNotify() {
  return request({
    url: '/todayStat/latestNotify',
    method: 'get',
  })
}

export function latestStatTrade() {
  return request({
    url: '/statTrade/latestStat',
    method: 'get',
  })
}

export function latestStatStoreTrade() {
  return request({
    url: '/statTrade/latestStoreStat',
    method: 'get',
  })
}

export function latestGoodsTop() {
  return request({
    url: '/statGoods/latestGoodsTop',
    method: 'get',
  })
}

