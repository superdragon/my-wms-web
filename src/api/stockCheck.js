import request from '@/utils/request'

export function stockStat() {
  return request({
    url: '/goodsStat/stat',
    method: 'post',
    requestMethod: 'form',
  })
}

