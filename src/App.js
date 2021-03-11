import { Redirect, Route, Switch } from "react-router";

import Home from './Home'
import Owner from './Owner'
import Customer from './Customer'
import Admin from './Admin'

function App() {
  return (
    <>
      <Route exact path="/">
        <Redirect to="/home"/>
      </Route>
      <Switch>
        <Route path="/home" component={Home}/>
        <Route path="/owner" component={Owner}/>
        <Route path="/customer" component={Customer}/>
        <Route path="/admin" component={Admin}/>
      </Switch>
    </>
  );
}

export default App;
