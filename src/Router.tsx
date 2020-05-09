import React from "react";
import { Router as ReactRouter, Switch, Route } from "react-router-dom";
import { Default } from "pages";
import { history } from "utils";

const Router = () => (
  <ReactRouter history={history}>
    <Switch>
      <Route component={Default} />
    </Switch>
  </ReactRouter>
);

export default Router;
