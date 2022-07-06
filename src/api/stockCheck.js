import request from '@/utils/request'

export function stockStat() {
  return request({
    url: '/goodsStat/stat',
    method: 'post',
    requestMethod: 'form',
  })
}

export function getGoodsNumByStoreId(data) {
  return request({
    url: '/goodsStat/getGoodsNumByStoreId',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

