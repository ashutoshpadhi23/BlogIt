import { routes } from "constants/routes";

import React from "react";

import Signup from "components/Authentication/Signup";
import Blogs from "components/Blogs";
import CreatePost from "components/Blogs/Create";
import FilterPost from "components/Blogs/Filter";
import ShowPost from "components/Blogs/Show";
import Sidebar from "components/commons/Sidebar";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => (
  <Router>
    <ToastContainer />
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-hidden p-12">
        <Switch>
          <Route exact component={Blogs} path={routes.blogs} />
          <Route exact component={CreatePost} path="/blogs/create" />
          <Route exact component={FilterPost} path="/blogs/filter" />
          <Route exact component={ShowPost} path="/blogs/:slug/show" />
          <Route exact component={Signup} path="/signup" />
          <Redirect exact from={routes.root} to={routes.blogs} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
