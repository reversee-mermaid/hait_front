import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"

import { api } from "../utils/customer-api"
import { pagenameContext } from './Main'

export default function Result() {
  const { setPagename } = useContext(pagenameContext)
  const { id } = useParams()
  const [data, setData] = useState({ rstrnt: {} })
  useEffect(() => {
    setPagename('예약 결과')

    api.getResult(id, ({ status, data }) => {
      if (status === 200) {
        return setData(data)
      }
    })
  }, [])

  return (
    <>
      <section className="content content-result">
        <div className="main-info">
          <p><strong className="rstrnt-nm">{data.rstrnt.nm}</strong>에</p>
          <p>대기번호 <strong className="reserv-no">#{data.seq}</strong>번으로</p>
          <p>예약 되었습니다.</p>
          <small><i>🥎</i>변동사항 발생 시 매장으로 직접 연락 바랍니다.<i>🥎</i></small>
        </div>
        <h3>상세 정보</h3>
        <div className="reserv-info">
          <p>연락처: {data.contact}</p>
          <p>인원수: {data.headcount}명</p>
          <p>대기번호: {data.seq}번</p>
          <p>남은 대기 팀: {data.rstrnt.realtime_total}팀</p>
        </div>
        <div className="rstrnt-info">
          <p>가게명: {data.rstrnt.nm}</p>
          <p>가게 연락처: {data.rstrnt.contact}</p>
          <p>가게 주소: {data.rstrnt.location}</p>
        </div>
      </section>
    </>
  )
}