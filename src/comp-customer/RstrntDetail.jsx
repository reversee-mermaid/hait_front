import { useContext, useEffect, useMemo, useState } from "react"
import { useParams, useRouteMatch } from "react-router"
import { Link } from "react-router-dom"

import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded'
import CallRoundedIcon from '@material-ui/icons/CallRounded'
import CommentIcon from '@material-ui/icons/Comment';

import { pagenameContext } from './Main'
import { api } from "../utils/customer-api"

export default function Detail() {
  const { setPagename } = useContext(pagenameContext)
  const { id } = useParams()
  const { url } = useRouteMatch()

  const [data, setData] = useState({})
  const {
    pk,
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
            <img src={`/resources/img/rstrnt/${pk}/${profile_img}`} alt="profile" />
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
        <p><LocationOnRoundedIcon/>{location}</p>
        <p><CallRoundedIcon/>{contact}</p>
        <p><CommentIcon/>{more_info}</p>
      </div>
      <Link className="btn" to={`${url}/reserv`}>예약하기</Link>
    </section>
  )
}