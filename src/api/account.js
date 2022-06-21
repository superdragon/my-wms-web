import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/account/login',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function autoLogin(data) {
  return request({
    url: '/account/autoLogin',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function updateAccount(data) {
  return request({
    url: '/account/update',
    method: 'post',
    data,
  })
}

export function saveAccount(data) {
  return request({
    url: '/account/save',
    method: 'post',
    data,
  })
}

export function updatePwd(data) {
  return request({
    url: '/account/updatePwd',
    method: 'post',
    data,
  })
}

export function updateNewPwd(data) {
  return request({
    url: '/account/updateNewPwd',
    method: 'post',
    data,
  })
}

export function getAccount(data) {
  return request({
    url: '/account/get',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function findAccounts(data) {
  return request({
    url: '/account/find',
    method: 'post',
    data,
  })
}

export function removeAccounts(data) {
  return request({
    url: '/account/remove',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function uploadCsv(data) {
  return request({
    url: '/account/uploadCsv',
    method: 'post',
    requestMethod: 'file',
    data,
  })
}
