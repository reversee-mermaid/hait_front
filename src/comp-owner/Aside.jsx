import { useCallback, useContext } from "react"
import { useHistory } from "react-router"
import { Link } from "react-router-dom"

import { asideContext, rstrntContext } from './Main'
import { api } from '../utils/owner-api'

export default function Aside() {
  const { state: aside } = useContext(asideContext)
  const { state: rstrnt } = useContext(rstrntContext)
  const history = useHistory()
  const logout = useCallback(() => {
    api.logout(() => history.replace("/owner/login"))
  })
  return (
    <aside className={`aside card ${aside.locked ? 'locked' : ''} ${aside.show ? 'show' : ''}`}>
      <header className="aside-header">
        <h1>H.ait - <small>{rstrnt.nm}</small></h1>
        <div className="card card-circle">
          <img src={`/resources/img/rstrnt/${rstrnt.pk}/${rstrnt.profile_img}`} alt="profile image" />
        </div>
      </header>
      <nav>
        <ul className="gnb">
          <li>
            <Link to="/owner/main">Dashboard</Link>
          </li>
          <li>
            <Link to="/owner/main/setting">Info & Setting</Link>
          </li>
          <li className="logout-link" onClick={logout}>
            Logout
            </li>
          <li className="small_link">
            <Link to="">Go to H.ait service page</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}