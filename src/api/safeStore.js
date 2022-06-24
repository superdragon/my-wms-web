import request from '@/utils/request'

export function addSafeStore(data) {
  return request({
    url: '/safeStore/add',
    method: 'post',
    data,
  })
}

export function updateSafeStore(data) {
  return request({
    url: '/safeStore/update',
    method: 'post',
    data,
  })
}

export function pageSafeStore(data) {
  return request({
    url: '/safeStore/page',
    method: 'post',
    data,
  })
}

export function removeSafeStore(data) {
  return request({
    url: '/safeStore/remove',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

