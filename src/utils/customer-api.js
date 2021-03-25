import { method } from './ajax'

function _fetch(url, method, data) {
  const info = `/api/customer/${url}`
  if(!method || !data) {
    return fetch(info).then(res => res.json())
  }

  let init = { method: method }
  if(data instanceof FormData) {
    init = {
      ...init,
      body: data
    }
  } else {
    init = {
      ...init,
      headers: { 'content-type': 'application/json'},
      body: JSON.stringify(data)
    }
  }

  return fetch(info, init).then(res => res.json())
}

export const api = {
  getCities: (cb) => {
    fetch('/api/home/cities')
      .then(res => res.json())
      .then(body => cb(body))
  },
  getRstrntAll: (cb) => {
    _fetch('restaurants')
      .then(body => cb(body))
  },
  getRstrnt: (pk, cb) => {
    _fetch(`restaurants/${pk}`)
      .then(body => cb(body))
  },
  reservation: (data, cb) => {
    _fetch('reservation', method.POST, data)
      .then(body => cb(body))
  },
  getResult: (pk, cb) => {
    _fetch(`reservation/${pk}`)
      .then(body => cb(body))
  }
}