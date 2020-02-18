import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import "gestalt/dist/gestalt.css";
import { getToken } from "./utils";

import App from "./components/App";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import CheckOut from "./components/checkout";
import NavBar from "./components/navbar";
import Brews from "./components/brews";

import registerServiceWorker from "./registerServiceWorker";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() !== null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/signin", sate: { from: props.location } }}
        />
      )
    }
  />
);

const Root = () => (
  <Router>
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route component={App} exact path="/" />
        <Route component={SignIn} path="/signin" />
        <Route component={SignUp} path="/signup" />
        <PrivateRoute component={CheckOut} path="/checkout" />
        <Route component={Brews} path="/:brandid" />
      </Switch>
    </React.Fragment>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
