import request from '@/utils/request'

export function addTransferList(data) {
  return request({
    url: '/transferList/add',
    method: 'post',
    data,
  })
}

export function pageTransferList(data) {
  return request({
    url: '/transferList/page',
    method: 'post',
    data,
  })
}

export function updateTransferStatus(data) {
  return request({
    url: '/transferList/updateStatus',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function pageTransferItem(data) {
  return request({
    url: '/transferItem/page',
    method: 'post',
    data,
  })
}
