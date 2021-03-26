import { useState, useEffect, useContext, useCallback, useRef } from 'react';

import { stateCode, asideContext, rstrntContext } from './Main'
import { api } from '../utils/owner-api'

export default function Header() {

  const asideBtn = useRef([])
  const { dispatch: asideDispatch } = useContext(asideContext)
  const { state: rstrnt } = useContext(rstrntContext)

  useEffect(() => {
    const btn = asideBtn.current
    btn.addEventListener('click', () => {
      asideDispatch({ type: 'LOCK' })
    })
    btn.addEventListener('mouseenter', () => {
      asideDispatch({ type: 'TOGGLE', state: true })
    })
    btn.addEventListener('mouseleave', () => {
      asideDispatch({ type: 'TOGGLE', state: false })
    })
  }, [])

  return (
    <header id="header" className="flex-row">
      <div>
        <button ref={asideBtn} className="aside-btn">=</button>
        <div className="state-btn-container">
          <StateLabel state={rstrnt.state} />
          <ul className="state-btn-dropdown">
            <li><StateLabel state={stateCode.CLOSE} /></li>
            <li><StateLabel state={stateCode.OPEN} /></li>
            <li><StateLabel state={stateCode.BREAK} /></li>
          </ul>
        </div>
      </div>
      {/* <Clock /> */}
    </header>
  )
}

function StateLabel({ state }) {
  const { state: rstrnt, dispatch } = useContext(rstrntContext)

  const stateHandle = useCallback(() => {
    if (state === rstrnt.state) return
    if (state === stateCode.CLOSE) {
      if (!window.confirm('남은 예약 건을 일괄 취소하겠습니까?')) return
    }

    api.changeRstrntState(state, ({ status }) => {
      if (status === 200) {
        return dispatch({ type: 'UPDATE_STATE', state: state })
      }
    })
  })

  return (
    <button onClick={stateHandle} className={`state-label ${stateCode[state]}`}>
      <span>{stateCode[state]}</span>
    </button>
  )
}

const days = ['일', '월', '화', '수', '목', '금', '토']

function format(now) {
  const hh = now.getHours()
  const mm = now.getMinutes()
  return (
    `
    ${now.getFullYear()}년
    ${now.getMonth()}월
    ${now.getDate()}일
    ${days[now.getDay()]}요일 |
    ${hh > 9 ? hh : `0${hh}`} :
    ${mm > 9 ? mm : `0${mm}`} 
    `
  )
}

function Clock() {
  const [time, setTime] = useState(new Date())

  const updateTime = () => { setTime(new Date()) }

  let interval

  useEffect(() => {
    interval = setInterval(updateTime, 1000)
    return () => { clearInterval(interval) }
  })

  return (
    <div id="datetime">{format(time)}</div>
  )
}