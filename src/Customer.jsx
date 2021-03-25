import { Route, Switch, Link } from "react-router-dom"

import { Main } from "./comp-customer/Main"

export default function Customer() {
  return (
    <div id="customer-app" className="flex-column">
      <Switch>
        <Route exact path="/customer" component={Index} />
        <Route component={Main} />
      </Switch>
    </div>
  )
}

function Index() {
  return (
    <main id="main">
      <section className="content content-visual">
        <div className="text">
          <small>I hate wait!</small>
          <h1>H.ait</h1>
          <p>이제,</p>
          <p>안에서 편하게 기다리자</p>
        </div>
        <Link className="btn btn-round" to={`/customer/restaurants`}>가게 찾기</Link>
      </section>
    </main>
  )
}