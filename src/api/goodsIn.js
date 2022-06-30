import request from '@/utils/request'

export function inStorePage(data) {
  return request({
    url: '/inStoreList/page',
    method: 'post',
    data,
  })
}

export function inStoreAdd(data) {
  return request({
    url: '/inStoreList/add',
    method: 'post',
    data,
  })
}

export function inStoreInfo(data) {
  return request({
    url: '/inStoreList/info',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function inStoreItemPage(data) {
  return request({
    url: '/inStoreItem/page',
    method: 'post',
    data,
  })
}

export function inStoreItemRemove(data) {
  return request({
    url: '/inStoreItem/remove',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function inStoreListRemove(data) {
  return request({
    url: '/inStoreList/remove',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

