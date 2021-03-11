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