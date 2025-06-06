import React from "react";

import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";

import Blogs from "./components/Blogs";
import Sidebar from "./components/commons/Sidebar";
import { routes } from "./constants/routes";

const App = () => (
  <Router>
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-hidden p-12">
        <Switch>
          <Route exact component={Blogs} path={routes.blogs} />
          <Redirect exact from={routes.root} to={routes.blogs} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
