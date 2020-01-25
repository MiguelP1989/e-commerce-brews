import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./index.css";

import App from "./components/App";
import SingIn from "./components/singin";
import SingUp from "./components/singup";
import CheckOut from "./components/checkout";

import registerServiceWorker from "./registerServiceWorker";

const Root = () => (
  <Router>
    <Switch>
      <Route component={App} exact path="/" />
      <Route component={SingIn} path="/singin" />
      <Route component={SingUp} path="/singup" />
      <Route component={CheckOut} path="/checkout" />
    </Switch>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
