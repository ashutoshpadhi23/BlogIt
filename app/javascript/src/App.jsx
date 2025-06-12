import React from "react";

import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";

import Blogs from "./components/Blogs";
import CreatePost from "./components/Blogs/Create";
import ShowPost from "./components/Blogs/Show";
import Sidebar from "./components/commons/Sidebar";
import { routes } from "./constants/routes";

const App = () => (
  <Router>
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-hidden p-12">
        <Switch>
          <Route exact component={Blogs} path={routes.blogs} />
          <Route exact component={CreatePost} path="/blogs/create" />
          <Route exact component={ShowPost} path="/blogs/:slug/show" />
          <Redirect exact from={routes.root} to={routes.blogs} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
