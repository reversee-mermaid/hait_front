import { Route, Switch, useRouteMatch } from 'react-router-dom'

import Header from './comp-home/Header'
import Index from './comp-home/Index'
import Application from './comp-home/Application'
import Result from './comp-home/Result'

export default function Home() {
  const { path } = useRouteMatch()
  return (
    <div id="home-app" className="flex-column">
      <Header />
      <main id="main">
        <Switch>
          <Route exact path={path} component={Index} />
          <Route exact path={`${path}/application`} component={Application} />
          <Route exact path={`${path}/result`} component={Result} />
          <Route>
            Page not found
          </Route>
        </Switch>
      </main>
    </div>
  )
}