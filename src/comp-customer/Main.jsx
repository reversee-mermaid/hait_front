import { createContext, useContext, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";

import logo from '../logo.svg'

import List from "./Rstrnt";
import Reserv from "./Reserv";
import Result from "./ReservResult";
import Detail from "./RstrntDetail";

export const pagenameContext = createContext({})

export function Main() {
  const [pagename, setPagename] = useState('');
  
  return (
    <pagenameContext.Provider value={{ pagename: pagename, setPagename: setPagename }}>
      <Header pagename={pagename} />
      <main id="main">
        <Switch>
          <Route path="/customer/restaurants/:id/reserv" component={Reserv} />
          <Route path="/customer/restaurants/:id" component={Detail} />
          <Route path="/customer/restaurants" component={List} />
          <Route path="/customer/result/:id" component={Result} />
        </Switch>
      </main>
    </pagenameContext.Provider>
  )
}

function Header() {
  const { pagename } = useContext(pagenameContext)
  return (
    <header id="header">
      <h1><Link to="/customer"><img src={logo} alt="logo" /></Link></h1>
      <h2>{pagename}</h2>
    </header>
  )
}