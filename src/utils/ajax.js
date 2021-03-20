export default function sendRequest(input, method, data) {
  
  let init = null

  if(method && data) {
    init = {
      method: method,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  }

  return (
    fetch(input, init)
      .then(res => res.json())
  )
}

function getInit(method, data) {
  return {
    method: method,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  }
}

export class AdminUtil {
  static login = async (id, pw) => (
    this._fetch('login', 'post', { id: id, pw: pw })
  )

  static logout = async () => (
    this._fetch('logout')
  )

  static _fetch = async (path, method, data) => {
    const url = `/api/admin/${path}`
    return fetch(url, data ? getInit(method, data) : null)
  }
}