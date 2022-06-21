import request from '@/utils/request'

export function uploadImage(data) {
  return request({
    url: '/file/uploadImage',
    method: 'post',
    requestMethod: 'file',
    data,
  })
}
