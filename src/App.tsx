import React, { useEffect } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import { attributeManager } from './attributeManager';
import { authenticationManager } from './authenticationManager';
import { Register } from './components/pages/Register';
import { SignIn } from './components/pages/SignIn';
import { User } from './components/User';
import { NavBar } from "./components/NavBar";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { teal } from '@material-ui/core/colors';
import { LoadingIndicator } from './components/commonComponents';
import { Project } from './components/Project';
import { CreateProject } from './components/CreateProject';
import { Home } from './components/pages/Home';
import { SideBar } from './components/SideBar';
import { SearchResults } from './components/pages/SearchResults';
import { Users } from './components/pages/Users';
import { Projects } from './components/pages/Projects';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: teal
  },
  props: {
    MuiInput: { inputProps: { spellCheck: 'false' } }
  }
});

export const App = () => {
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const [isSideBarOpen, setIsSideBarOpen] = React.useState<boolean>(false);

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

  const getContent = () => {
    if (!isInitialized) {
      return <LoadingIndicator />
    }
    return (
      <BrowserRouter>
        <SideBar isOpen={isSideBarOpen} onChange={() => setIsSideBarOpen(!isSideBarOpen)} />
        <Route exact path="/" component={Home} />
        <Route path="/login" component={SignIn} />
        <Route path="/register" component={Register} />
        <Route path="/user/:username" component={User} />
        <Route path="/project/:name" component={Project} />
        <Route path="/search" component={SearchResults} />
        <Route path="/users" component={Users} />
        <Route path="/projects" component={Projects} /> 
        <AuthenticatedRouter path="/createProject" component={CreateProject} />
      </BrowserRouter>
    );
  };

  return (
    <MuiThemeProvider theme={theme}>
      <NavBar menuOnClick={() => setIsSideBarOpen(!isSideBarOpen)} />
      {getContent()}
    </MuiThemeProvider>
  );
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