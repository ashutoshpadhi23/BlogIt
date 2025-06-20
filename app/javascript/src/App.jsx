import { routes } from "constants/routes";

import React from "react";

import { Login, Signup } from "components/Authentication";
import Blogs from "components/Blogs";
import CreatePost from "components/Blogs/Create";
import EditPost from "components/Blogs/Edit";
import FilterPost from "components/Blogs/Filter";
import ShowPost from "components/Blogs/Show";
import { PrivateRoute } from "components/commons";
import Sidebar from "components/commons/Sidebar";
import { either, isEmpty, isNil } from "ramda";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getFromLocalStorage } from "utils/storage";

const App = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  return (
    <Router>
      <ToastContainer />
      <div className="flex h-screen">
        {isLoggedIn && <Sidebar />}
        <div className="flex-1 overflow-hidden p-12">
          <Switch>
            {/* <Route exact component={Blogs} path={routes.blogs} /> */}
            <Route exact component={CreatePost} path="/blogs/create" />
            <Route exact component={FilterPost} path="/blogs/filter" />
            <Route exact component={ShowPost} path="/blogs/:slug/show" />
            <Route exact component={EditPost} path="/blogs/:slug/edit" />
            <Route exact component={Signup} path="/signup" />
            <Route exact component={Login} path="/login" />
            <PrivateRoute
              component={Blogs}
              condition={isLoggedIn}
              path="/"
              redirectRoute="/login"
            />
            <Redirect exact from={routes.root} to={routes.blogs} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
