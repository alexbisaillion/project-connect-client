import React, { useEffect } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import { attributeManager } from './attributeManager';
import { authenticationManager } from './authenticationManager';
import { Register } from './components/pages/Register';
import { SignIn } from './components/pages/SignIn';
import { User } from './components/User';
import { Users } from './components/Users'
import { NavBar } from "./components/NavBar";

export const App = () => {
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);

  useEffect(() => {
    async function initialize() {
      await authenticationManager.init();
      await attributeManager.init();
      setIsInitialized(true);
    }
    if (!isInitialized) {
      initialize();
    }
  });

  if (!isInitialized) {
    return <div>Loading</div>
  }
  return (
    <BrowserRouter>
      <NavBar />
      <Route path="/login" component={SignIn} />
      <Route path="/register" component={Register} />
      <Route path="/user/:username" component={User} />
      <AuthenticatedRouter path="/home" component={DummyHomePage} />
      <AuthenticatedRouter path="/users" component={Users} />
    </BrowserRouter>
  );
}

const DummyHomePage = () => {
  return <h1>Home</h1>;
}

type AuthenticatedRouterProps = {
  component: any;
  path: string;
}
export const AuthenticatedRouter = (props: AuthenticatedRouterProps) => {
  const { component: Component, path } = props;

  return (
    <Route
      path={path}
      render={() =>
        authenticationManager.getIsLoggedIn() ? (
          <Component />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};