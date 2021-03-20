import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Link, Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { setPreview } from './utils/preview'

const stateCode = {
  '-1': 'close',
  '0': 'break',
  '1': 'open',
  CLOSE: '-1',
  BREAK: '0',
  OPEN: '1'
}

const state = {
  CLOSE: {
    name: 'Close',
    value: -1
  },
  BREAK: {
    name: 'Break',
    value: 0
  },
  OPEN: {
    name: 'Open',
    value: 1
  }
}

const initialState = {
  rstrnt: {
    pk: null,
    status: state.CLOSE.value,
  },
  owner: {
    pk: null,
    nm: null,
  },
  aside: {
    locked: false,
    show: false
  }
}

export default function Owner() {
  const { path } = useRouteMatch()
  return (
    <div id="owner-app" className="flex-column">
      <Switch>
        <Route exact path="/owner">
          <Redirect to="/owner/main" />
        </Route>
        <Route path={`${path}/login`} component={Login} />
        <Route path={`${path}/initial-setting`} component={InitialSetting} />
        <Route path={`${path}/main`} component={Main} />
      </Switch>
    </div>
  )
}

function Login() {
  const [message, setMessage] = useState(null)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  const history = useHistory()

  const handleEmail = (e) => setEmail(e.target.value)
  const handlePw = (e) => setPw(e.target.value)

  const onSubmit = (e) => {
    e.preventDefault()

    const data = {
      email: email,
      pw: pw
    }

    fetch('/api/owner/login', {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.ok) {
          history.push('/owner/main')
        }
      })
  }

  return (
    <main id="main">
      <section className="content content-login flex-column">
        <h2 className="content-title">사장님으로 로그인</h2>
        <p>{message}</p>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            value={email}
            onChange={handleEmail}
            placeholder="이메일"
          />
          <input
            type="password"
            value={pw}
            onChange={handlePw}
            placeholder="비밀번호"
          />
          <button className="btn">로그인</button>
        </form>
        <p className="small_link">
          아직 가게 등록을 하지 않으셨나요?
        <Link className="link" to="/home/application" target="_blank">가게등록</Link>
        </p>
      </section>
    </main>
  )
}

const formInit = {
  location: '',
  contact: '',
  more_info: '',
  reset_pw: '',
  file: null,
  data: '',
  pk: 0,
  owner_pk: 0
}

const formReducer = (state, action) => {

}

function InitialSetting() {
  const [state, dispatch] = useReducer(formReducer, formInit)
  const {pk, file, contact, location, more_info, reset_pw, owner_pk} = state
  const [data, setData] = useState(null)

  const history = useHistory()

  const container = useRef()

  useEffect(() => {
    if (file) {
      setPreview(container.current, file)
    }
  }, [file])

  useEffect(() => {
    fetch('/api/owner/restaurant')
      .then(res => {
        if (res.ok) {
          return res.json()
        }
      })
      .then(({ data }) => {
        console.log(data)
        setData(data)
      })
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('pk', pk)
    formData.append('file', file)
    formData.append('contact', contact)
    formData.append('location', location)
    formData.append('reset_pw', reset_pw)
    formData.append('more_info', more_info)
    formData.append('owner_pk', owner_pk)

    fetch('/api/owner/restaurant', {
      method: 'put',
      body: formData
    })
      .then(res => {
        if (res.ok) {
          history.push("/owner")
        }
      })

  }

  const inputHandle = (e) => {
    switch (e.target.name) {
      case 'file':
        break
      case 'location':
        break
      case 'contact':
        break
      case 'more_info':
        break
      case 'reser_pw':
        break
      default:
        break
    }
  }

  return (
    <main id="main">
      <section className="content content-initial flex-column">
        <h2 className="content-title">Welcome to {data && data.nm}!</h2>
        <small>서비스 시작 전 초기 설정이 필요합니다.</small>
        <form onSubmit={onSubmit}>
          <div ref={container} className="card card-circle"></div>
          <input type="file" name="file" accept="image/*"
            onChange={inputHandle} />
          <input type="text" name="location" value={location} required
            onChange={inputHandle} placeholder="매장 주소" />
          <input type="tel" name="contact" value={contact} required
            onChange={inputHandle} placeholder="매장 전화번호" />
          <textarea name="more_info" value={more_info}
            onChange={inputHandle} placeholder="기타 매장 정보" />
          <input type="password" name="reser_pw" value={reset_pw} required
            onChange={inputHandle} placeholder="새 비밀번호" />

          <button className="btn">시작하기</button>
        </form>
      </section>
    </main>
  )
}

const asideInit = {
  locked: false,
  show: false
}

function asideReducer(state, action) {
  switch (action.type) {
    case 'LOCK':
      return { ...state, locked: action.locked }
    case 'SHOW':
      return { ...state, show: true }
    case 'HIDE':
      return { ...state, show: false }
    default:
      break
  }
}

const rstrntInit = {
  state: stateCode.CLOSE
}

function rstrntReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_STATE':
      return {
        ...state,
        state: action.state
      }
    case 'SET_DATA':
      return {
        ...state,
        state: action.state
      }
    default:
      break;
  }
}

function Main() {

  const history = useHistory()

  const [aside, asideDispatcher] = useReducer(asideReducer, asideInit)
  const [rstrnt, rstrntDispatcher] = useReducer(rstrntReducer, rstrntInit)

  useEffect(() => {
    fetch("/api/owner/restaurant")
      .then(res => res.json())
      .then(({ status, message, data }) => {
        switch (status) {
          case 401:
            return history.push('/owner/login')
          case 403:
            return history.push('/owner/initial-setting')
          default:
            return rstrntDispatcher({ type: 'SET_DATA', state: data.state })
        }
      })
  }, [])

  return (
    <>
      <Header
        asideReducer={[aside, asideDispatcher]}
        rstrntReducer={[rstrnt, rstrntDispatcher]} />
      <main id="main" className={aside.locked ? 'flex-row' : ''}>
        <AsideMenu state={aside} rstrntData={rstrnt.data} />
        {
          rstrnt.state < 0 ?
            <Close /> :
            <Dashboard state={rstrnt.state} />
        }
      </main>
    </>
  )
}

function Header({ asideReducer, rstrntReducer }) {
  const [aside, asideDispatcher] = asideReducer;
  const [rstrnt, rstrntDispatcher] = rstrntReducer;

  const asideHandle = (e) => {
    switch (e.type) {
      case 'click':
        return asideDispatcher({ type: 'LOCK', locked: !aside.locked })
      case 'mouseenter':
        return asideDispatcher({ type: 'SHOW' })
      case 'mouseleave':
        return asideDispatcher({ type: 'HIDE' })
      default:
        break;
    }
  }

  const stateHandle = (state) => {
    if (state == rstrnt.state) return

    if (state === '-1') {
      if (!window.confirm('남은 예약 건을 일괄 취소하겠습니까?')) {
        return
      }
    }

    const data = { state: state }
    fetch('/api/owner/restaurant/state', {
      method: 'put',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(({ status, message }) => {
        if (status === 200) {
          rstrntDispatcher({ type: 'UPDATE_STATE', state: state })
        }
      })
  }

  const label = (state, useEvent = true) => {
    return (
      <button
        onClick={() => useEvent && stateHandle(state)}
        className={`state-label ${stateCode[state]}`}
      >
        <span>{stateCode[state]}</span>
      </button>
    )
  }

  return (
    <header id="header" className="flex-row">
      <div>
        <button
          className="aside-btn"
          onClick={asideHandle}
          onMouseEnter={asideHandle}
          onMouseLeave={asideHandle}>=</button>
        <div className="state-btn-container">
          {label(rstrnt.state, false)}
          <ul className="state-btn-dropdown">
            <li>{label(stateCode.CLOSE)}</li>
            <li>{label(stateCode.OPEN)}</li>
            <li>{label(stateCode.BREAK)}</li>
          </ul>
        </div>
      </div>
      {/* <Clock /> */}
    </header>
  )
}

function AsideMenu({ state, rstrntData }) {
  const history = useHistory()
  const logout = () => {
    fetch('/api/owner/logout')
      .then(res => {
        if (res.ok) {
          history.replace("/owner/login")
        }
      })
  }
  return (
    <aside className={`aside card ${state.locked ? 'locked' : ''} ${state.show ? 'show' : ''}`}>
      <header className="aside-header">
        <h1>H.ait</h1>
        <p>owner's</p>
        <p>tete</p>
      </header>
      <nav>
        <ul className="lnb">
          <li>a</li>
          <li>a</li>
          <li>a</li>
          <li>a</li>
          <li>a</li>
        </ul>
        <ul className="gnb">
          <li>setting</li>
          <li className="logout-link" onClick={logout}>logout</li>
        </ul>
      </nav>
      <small className="small_link"><Link to="">Go to H.ait service page</Link></small>
    </aside>
  )
}

function Close() {
  return (
    <section className="content content-close">
      <p>지금은 <strong className="state-label close">Close</strong> 상태입니다.</p>
      <p>Dashboard는 <strong className="state-label open">Open</strong> 후에 사용 가능합니다.</p>
    </section>
  )
}

const reservInit = {
  detail: null
}

function reservReducer(state, action) {
  switch (action.type) {
    case 'SHOW_DETAIL':
      return {
        ...state,
        detail: action.data
      }
    default:
      break;
  }
}

function Dashboard({ state }) {
  const [reserv, reservDispatcher] = useReducer(reservReducer, reservInit)
  const data = {
    no: 1,
    headcount: 4,
    contact: '000-0000-0000',
    regTime: '22:22',
    waitTime: '00:00'
  }

  return (
    <section className="content content-open">
      <div className="list">
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 2 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 3 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 4 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 5 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 6 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 7 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 8 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 9 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 10 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 11 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 12 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 10 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 11 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 12 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 10 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 11 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 12 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 10 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 11 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 12 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 10 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 11 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 12 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 10 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 11 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 12 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 10 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 11 }}
        />
        <ReservItem
          reducer={[reserv, reservDispatcher]}
          data={{ ...data, no: 12 }}
        />
      </div>
      <div className="info">
        <div className="realtime-total card card-circle">
          <p>현재 대기 팀 수</p>
          <strong>10</strong>
          <p>팀</p>
        </div>
        <ReservDetail data={reserv.detail} state={state} />
      </div>
    </section>
  )
}
function ReservItem({ data, reducer }) {
  const [reserv, dispatcher] = reducer
  const detailHandle = () => {
    dispatcher({ type: 'SHOW_DETAIL', data: data })
  }

  return (
    <div className="list-item card" onClick={detailHandle}>
      <strong className="reserv-no">
        #{data.no < 10 ? `0${data.no}` : data.no}
      </strong>
      <div>
        <p className="reserv-headcount">
          {data.headcount < 10 ? `0${data.headcount}` : data.headcount} 명
      </p>
        <p className="reserv-waittime">
          ⏰{data.waitTime}
        </p>
      </div>
    </div>
  )
}

function ReservDetail({ data, state }) {
  if (data) {
    return (
      <>
        <div className="detail card">
          <p className="detail-no">
            #{data.no < 10 ? `0${data.no}` : data.no}
          </p>
          <p className="detail-headcount">
            {data.headcount < 10 ? `0${data.headcount}` : data.headcount} 명
        </p>
          <p className="detail-contact">
            {data.contact}
          </p>
          <p className="detail-regtime">
            등록 시간 | {data.regTime}
          </p>
          <p className="detail-waittime">
            대기 시간 | {data.waitTime}
          </p>
        </div>
        <div className="btn-container">
          <button className="btn reserv-btn">취소</button>
          <button className="btn reserv-btn">착석</button>
          {state > 0 && <button className="btn reserv-btn">호출</button>}
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="detail card">
          <p>선택 된 아이템이 없습니다.</p>
        </div>
        <div className="btn-container">
          <button className="btn reserv-btn">취소</button>
          <button className="btn reserv-btn">착석</button>
          {state > 0 && <button className="btn reserv-btn">호출</button>}
        </div>
      </>
    )
  }
}


function Open() {
  const data = {
    no: 1,
    headcount: 4,
    contact: '000-0000-0000',
    regTime: '22:22',
    waitTime: '00:00'
  }

  return (
    <section className="content content-open">
      <div className="list">
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
        <ReservItem data={data} />
      </div>
      <div className="info">
        <div className="realtime-total card card-circle">
          <p>현재 대기 팀 수</p>
          <strong>10</strong>
          <p>팀</p>
        </div>
        <ReservDetail data={data} />
      </div>
    </section>
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