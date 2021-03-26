import { createContext, useEffect, useReducer } from "react"
import { Route, Switch, useHistory } from "react-router"

import Header from './Header'
import Aside from './Aside'
import Dashboard from './Dashboard'
import Setting from './Setting'

import { api } from '../utils/owner-api'

export const stateCode = {
  '-1': 'close',
  '0': 'break',
  '1': 'open',
  CLOSE: '-1',
  BREAK: '0',
  OPEN: '1'
}

const asideInit = {
  locked: false,
  show: false
}

function asideReducer(state, action) {
  switch (action.type) {
    case 'LOCK':
      return { ...state, locked: !state.locked }
    case 'TOGGLE':
      return { ...state, show: action.state }
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
      return action.data
    case 'SET_MORE_INFO':
      return {
        ...state,
        more_info: action.data
      }
    case 'SET_PROFILE_IMG':
      return {
        ...state,
        profile_img: action.data
      }
    default:
      break;
  }
}

export const asideContext = createContext({
  state: {},
  dispatch: () => { }
})
export const rstrntContext = createContext({
  state: {},
  dispatch: () => { }
})

export default function Main() {
  const history = useHistory()
  const [aside, asideDispatch] = useReducer(asideReducer, asideInit)
  const [rstrnt, rstrntDispatch] = useReducer(rstrntReducer, rstrntInit)

  useEffect(() => {
    api.getRstrntInfo(({ status, data }) => {
      if (status === 401) return history.push('/owner/login')
      if (status === 403) return history.push('/owner/initial-setting')
      rstrntDispatch({ type: 'SET_DATA', data: data })
    })
  }, [])

  return (
    <rstrntContext.Provider value={{ state: rstrnt, dispatch: rstrntDispatch }}>
      <asideContext.Provider value={{ state: aside, dispatch: asideDispatch }}>
        <Header />
        <main id="main" className={aside.locked ? 'flex-row' : ''}>
          <Aside />
          <Switch>
            <Route exact path="/owner/main">
              {
                rstrnt.state < 0 ?
                  <Close /> :
                  <Dashboard />
              }
            </Route>
            <Route path="/owner/main/setting" component={Setting} />
          </Switch>
        </main>
      </asideContext.Provider>
    </rstrntContext.Provider>
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