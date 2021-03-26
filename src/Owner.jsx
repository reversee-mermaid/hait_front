import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'

import Login from './comp-owner/Login'
import InitialSetting from './comp-owner/InitialSetting'
import Main from './comp-owner/Main'

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