import request from '@/utils/request'

export function listCustomer(data) {
  return request({
    url: '/customer/list',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function listCustomerAddress(data) {
  return request({
    url: '/customerAddress/list',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}

export function getCustomer(data) {
  return request({
    url: '/customer/get',
    method: 'post',
    requestMethod: 'form',
    data,
  })
}
