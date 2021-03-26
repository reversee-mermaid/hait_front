import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react"
import { api } from "../utils/owner-api";
import { rstrntContext, stateCode } from "./Main";

const reservInit = {
  list: [],
  detail: null,
  realtime_total: 0
}

function reservReducer(state, action) {
  switch (action.type) {
    case 'SET_DETAIL':
      return {
        ...state,
        detail: action.data
      }
    case 'SET_LIST':
      return {
        ...state,
        list: action.data
      }
    case 'SET_TOTAL':
      return {
        ...state,
        realtime_total: action.data
      }
    case 'UNSHIFT_ITEM':
      state.list.unshift(action.data)
      return {
        ...state
      }
    case 'SPLICE_ITEM':
      state.list.splice(action.index, 1)
      return {...state}
    default:
      break;
  }
}
const reservContext = createContext()

export default function Dashboard() {
  const [state, dispatch] = useReducer(reservReducer, reservInit)

  useEffect(() => {
    if (state !== stateCode.CLOSE) {
      api.getReservList(({ status, data }) => {
        if (status === 200) {
          dispatch({ type: 'SET_LIST', data: data })
          dispatch({ type: 'SET_TOTAL', data: data.length })
        }
      })
    }
  }, [])

  return (
    <reservContext.Provider value={{ state, dispatch }}>
      <section className="content content-open">
        <div className="list">
          {
            state.list &&
            state.list.map(item => {
              return <ReservItem key={item.pk} data={item} />
            })
          }
        </div>
        <div className="info">
          <div className="realtime-total card card-circle">
            <p>현재 대기 팀 수</p>
            <strong>{state.realtime_total}</strong>
            <p>팀</p>
          </div>
          <ReservDetail />
        </div>
      </section>
    </reservContext.Provider>
  )
}

function ReservItem({ data }) {
  const { state:reserv, dispatch } = useContext(reservContext)
  const { seq, headcount, process_status: status, regdate } = useMemo(() => data, [reserv.list])

  const detailHandle = useCallback(() => {
    dispatch({ type: 'SET_DETAIL', data: data })
  })

  return (
    <div className={`list-item card ${status === 1 ? 'called' : ''}`} onClick={detailHandle}>
      <strong className="reserv-no">
        #{seq < 10 ? `0${seq}` : seq}
      </strong>
      <div>
        <p className="reserv-headcount">
          {headcount < 10 ? `0${headcount}` : headcount} 명
      </p>
        <p className="reserv-waittime">
          ⏰
        </p>
      </div>
    </div>
  )
}

function ReservDetail() {
  const { state } = useContext(reservContext)
  const data = useMemo(() => state.detail, [state])
  if (data) {
    return (
      <>
        <div className="detail card">
          <p className="detail-no">
            #{data.seq < 10 ? `0${data.seq}` : data.seq}
          </p>
          <p className="detail-headcount">
            {data.headcount < 10 ? `0${data.headcount}` : data.headcount} 명
        </p>
          <p className="detail-contact">
            {data.contact}
          </p>
          <p className="detail-regtime">
            등록 시간 | {data.regdate}
          </p>
          <p className="detail-waittime">
            대기 시간 |
          </p>
        </div>
        <BtnContainer />
      </>
    )
  } else {
    return (
      <>
        <div className="detail card">
          <p>선택 된 아이템이 없습니다.</p>
        </div>
        <BtnContainer />
      </>
    )
  }
}

const statusCode = {
  CALCELED_SOLDOUT: -3,
  CANCELED_RSTRNT: -2,
  CANCELED_CUSTOMER: -1,
  RESERVED: 0,
  CALLED: 1,
  CONFIRMED: 2
}

function BtnContainer() {
  const { state: rstrnt } = useContext(rstrntContext)
  const { state: reserv, dispatch: reservDispatch } = useContext(reservContext)
  const { detail, list } = reserv

  const dropdownMenu = useRef(null)

  const handleCancelMenu = () => {
    dropdownMenu.current.classList.toggle('show')
  }

  const handleStatus = (process_status) => {
    if (!detail) return
    if (detail.process_status === process_status) return

    const data = {
      pk: detail.pk,
      contact: detail.contact,
      process_status: process_status
    }

    api.updReservStatus(data, ({ status }) => {
      if (status === 200) {
        const find = list.find(item => item.pk === detail.pk)
        reservDispatch({ type: 'SPLICE_ITEM', index: list.indexOf(find) })
        
        if(process_status === statusCode.CALLED) {
          find.process_status = data.process_status
          reservDispatch({ type: 'UNSHIFT_ITEM', data: find })
        } else {
          reservDispatch({ type: 'SET_DETAIL', data: null })
          reservDispatch({ type: 'SET_TOTAL', data: list.length })
        }
      }
    })
  }

  return (
    <div className="btn-container">
      <button className="btn reserv-btn" onClick={handleCancelMenu}>취소</button>
      <button className="btn reserv-btn"
        onClick={() => { handleStatus(statusCode.CONFIRMED) }}>
        착석
      </button>
      {
        rstrnt.state > 0 &&
        <button className="btn reserv-btn"
          onClick={() => { handleStatus(statusCode.CALLED) }}>
          호출
        </button>
      }
      <ul className="cancel-menu" ref={dropdownMenu}>
        <li onClick={() => { handleStatus(statusCode.CANCELED_CUSTOMER) }}>고객사정</li>
        <li onClick={() => { handleStatus(statusCode.CANCELED_RSTRNT) }}>가게사정</li>
        <li onClick={() => { handleStatus(statusCode.CALCELED_SOLDOUT) }}>재료소진</li>
      </ul>
    </div>
  )
}