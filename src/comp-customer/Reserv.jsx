import { useCallback, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"

import { api } from "../utils/customer-api"
import { pagenameContext } from './Main'

import img from '../default.jpg'

export default function Reserv() {
  const { setPagename } = useContext(pagenameContext)
  const { id } = useParams()
  const history = useHistory()

  const [data, setData] = useState({})
  const [formData, setFormData] = useState({
    headcount: 0,
    contact: '',
    confirm: null,
  })

  useEffect(() => {
    setPagename('예약하기')
    api.getRstrnt(id, ({ status, data }) => {
      if (status === 200) {
        setData(data)
      }
    })
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()

    api.reservation(
      { ...formData, rstrnt_pk: data.pk },
      ({ status, data: pk }) => {
        if (status === 200) {
          return history.push(`/customer/result/${pk}`)
        }
        window.alert(
          `입력하신 연락처로 예약된 식당이 이미 존재합니다.`
        )
      }
    )
  }

  const inputHandle = useCallback((e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  })

  return (
    <section className="content content-reserv">
      <div className="info">
        <div className="card card-circle profile-img">
          {
            data.profile_img &&
            <img src={img} alt="profile" />
          }
        </div>
        <p><strong>{data.nm}</strong><span>에 예약합니다.</span></p>
      </div>
      <form onSubmit={onSubmit}>
        <input type="tel" name="contact" placeholder="연락처" required
          value={formData.contact} onChange={inputHandle} />
        <select name="headcount" required
          onChange={inputHandle}>
          <option value="">인원수</option>
          <option value="1">1 명</option>
          <option value="2">2 명</option>
          <option value="3">3 명</option>
          <option value="4">4 명</option>
          <option value="5">5 명</option>
        </select>
        <label>
          <input type="checkbox" name="confirm" required
            onChange={inputHandle} />
          정보 제공에 동의합니다.
        </label>
        <button className="btn">예약하기</button>
      </form>
    </section>
  )
}