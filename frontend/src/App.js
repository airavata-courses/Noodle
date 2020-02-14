import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import routes from "./routes";
import PublicLayout from "./shared/layout/PublicLayout";
import AuthLayout from "./shared/layout/AuthLayout";
import LoginPage from "./components/login";
import DashboardPage from "./components/DashBoard";

const pages = [  
  {
    exact: true,
    path: routes.login,
    component: LoginPage,
    layout: PublicLayout
  },  
  {
    exact: false,
    path: routes.dashboard,
    component: DashboardPage,
    layout: AuthLayout
  }
];

const App = () => {
  const history = createBrowserHistory();

  return (
    <Router history={history}>
      <Switch>
        {pages.map(
          ({ exact, path, component: Component, layout: Layout }, index) => (
            <Route
              key={index}
              exact={exact}
              path={path}
              render={props => (
                <Layout history={props.history}>
                  <Component {...props} />
                </Layout>
              )}
            />
          )
        )}
        <Redirect to={routes.dashboard} />        
      </Switch>
    </Router>
  );
};

export default App;
