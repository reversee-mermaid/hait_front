import { useContext, useEffect, useMemo, useState } from "react"
import { useParams, useRouteMatch } from "react-router"
import { Link } from "react-router-dom"

import { pagenameContext } from './Main'
import { api } from "../utils/customer-api"

export default function Detail() {
  const { setPagename } = useContext(pagenameContext)
  const { id } = useParams()
  const { url } = useRouteMatch()

  const [data, setData] = useState({})
  const {
    profile_img,
    realtime_total,
    nm,
    location,
    contact,
    more_info
  } = useMemo(() => data)

  useEffect(() => {
    setPagename('가게 정보')

    api.getRstrnt(id, ({ status, data }) => {
      if (status === 200) {
        setData(data)
      }
    })
  }, [])

  return (
    <section className="content content-detail">
      <div className="card-container">
        <div className="card card-circle profile-img">
          {
            profile_img &&
            <img src={profile_img} alt="profile" />
          }
        </div>
        <div className="card card-circle realtime-total">
          <p>대기 중</p>
          <strong>{realtime_total}</strong>
          <p>팀</p>
        </div>
      </div>
      <div className="info">
        <h2>{nm}</h2>
        <p><i>📍</i>{location}</p>
        <p><i>📞</i>{contact}</p>
        <p><i>📝</i>{more_info}</p>
      </div>
      <Link className="btn" to={`${url}/reserv`}>예약하기</Link>
    </section>
  )
}