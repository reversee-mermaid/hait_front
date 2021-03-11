import { useRouteMatch } from "react-router"
import { Link } from "react-router-dom"

import logo from '../logo.svg'

export default function Header() {
  const { path } = useRouteMatch()
  return (
    <header id="header" className="flex-row">
      <h1 className="logo">
        <Link to="">
          <img src={logo} alt="h.ait logo" />
        </Link>
      </h1>
      <nav className="gnb">
        <ul>
          <li>
            <Link to="/home">홈</Link>
          </li>
          <li>
            <Link className="btn btn-round" to={`${path}/application`}>사용 신청</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}