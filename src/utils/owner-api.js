import { method } from './ajax'

function _fetch(url, method, data) {
  const info = `/api/owner/${url}`
  if (!method || !data) {
    return fetch(info).then(res => res.json())
  }

  let init = { method: method }
  if (data instanceof FormData) {
    init = {
      ...init,
      body: data
    }
  } else {
    init = {
      ...init,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    }
  }

  return fetch(info, init).then(res => res.json())
}

export const api = {
  login: (data, cb) => {
    _fetch('login', method.POST, data)
      .then(body => cb(body))
  },
  logout: (cb) => {
    _fetch('logout')
      .then(() => cb())
  },
  updRstrnt: (data, cb) => {
    _fetch('restaurant', method.PUT, data)
      .then(body => cb(body))
  },
  getInitialInfo: (cb) => {
    _fetch('restaurant/initial')
      .then(body => cb(body))
  },
  initialSetting: (data, cb) => {
    _fetch('restaurant/initial', method.PUT, data)
      .then(body => cb(body))
  },
  getRstrntInfo: (cb) => {
    _fetch('restaurant')
      .then(json => cb(json))
  },
  getOwnerInfo: (cb) => {
    _fetch('')
      .then(json => cb(json))
  },
  changeRstrntState: (state, cb) => {
    _fetch('restaurant/state', method.PUT, { state: state })
      .then(body => cb(body))
  },
  getReservList: (cb) => {
    _fetch('reservations')
      .then(body => cb(body))
  },
  updReservStatus: (data, cb) => {
    _fetch('reservations', method.PUT, data)
      .then(body => cb(body))
  }
}