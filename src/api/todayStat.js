import request from '@/utils/request'

export function todayStatTotal() {
  return request({
    url: '/todayStat/total',
    method: 'get',
  })
}

