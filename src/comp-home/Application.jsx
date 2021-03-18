import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import sendRequest from "../utils/ajax"

export default function Application() {

  const history = useHistory()

  const [errMessage, setErrMessage] = useState('')

  const [cities, setCities] = useState(null)

  const [more_info, setMore_info] = useState('')
  const [rstrnt_nm, setRstrnt_nm] = useState('')
  const [owner_nm, setOwner_nm] = useState('')
  const [owner_email, setOwner_email] = useState('')
  const [owner_contact, setOwner_contact] = useState('')
  const [city_pk, setCity_pk] = useState('')

  const data = {
    rstrnt_nm: rstrnt_nm,
    owner_nm: owner_nm,
    owner_contact: owner_contact,
    owner_email: owner_email,
    more_info: more_info,
    city_pk: city_pk
  }

  const onSubmit = (e) => {
    e.preventDefault()

    fetch('/api/home/applications', {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if(!res.ok) {
          setErrMessage('Failed to apply...')
        } else {
          history.push('/home/result')
        }
      })
  }

  useEffect(() => {
    sendRequest('/api/home/cities')
      .then(json => {
        const list = json.cities.map(city => (
          <option key={city.pk} value={city.pk}>{city.nm}</option>
        ))
        setCities(list)
      })
  }, [])

  return (
    <section className="content content-application flex-column">
      <h2 className="content-title">서비스 사용 신청서</h2>
      <p className="err-message">{errMessage}</p>
      <form onSubmit={onSubmit}>
        <input
          type="text" maxLength="50" required
          value={rstrnt_nm} onChange={(e) => setRstrnt_nm(e.target.value)}
          placeholder="매장명 (상호명)" />

        <input
          type="text" maxLength="50" required
          value={owner_nm} onChange={(e) => setOwner_nm(e.target.value)}
          placeholder="신청인 이름" />

        <input
          type="tel" maxLength="100" required
          value={owner_contact} onChange={(e) => setOwner_contact(e.target.value)}
          placeholder="신청인 연락처" />

        <input
          type="email" maxLength="20" required
          value={owner_email} onChange={(e) => setOwner_email(e.target.value)}
          placeholder="신청인 이메일" />

        <select required onChange={(e) => setCity_pk(e.target.value)}>
          <option value="">시</option>
          {cities}
        </select>

        <textarea
          placeholder="기타 요청사항"
          onChange={(e) => setMore_info(e.target.value)}
          value={more_info} />

        <button className="btn">승인신청</button>
      </form>
    </section>
  )
}