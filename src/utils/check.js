import store from "@/store"

export const checkPermission = function (key) {
  const myPermissions = store.state.account.btnMap
  if (myPermissions[key]) {
    return true
  }
  return false
}
