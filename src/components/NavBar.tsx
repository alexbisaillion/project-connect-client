import React from "react";
import styled from "styled-components";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { authenticationManager } from '../authenticationManager';
import { Link } from "react-router-dom";

const NavBarContainer = styled.div`
  flex-grow: 1;
`;

const StyledIconButton = styled(IconButton)`
  margin-right: 16px;
`

type NavBarProps = {
  menuOnClick: () => void;
}
export const NavBar = (props: NavBarProps) => {
  const attemptLogout = async () => {
    await authenticationManager.attemptLogout();
    window.location.reload();
  }

  const renderUserSection = () => {
    if (authenticationManager.getIsLoggedIn()) {
      return (
        <>
          <Button component={ Link } to={`/user/${authenticationManager.getLoggedInUser()}`} color="inherit">View profile</Button>
          <Button color="inherit" onClick={() => attemptLogout()}>Log out</Button>
        </>
      )
    }
    return <Button component={ Link } to={"/login"} color="inherit">Log in</Button>
  }

  return (
    <NavBarContainer>
      <AppBar position="static">
        <Toolbar variant="dense">
          <StyledIconButton edge="start" color="inherit" aria-label="menu" onClick={props.menuOnClick}>
            <MenuIcon />
          </StyledIconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>ProjectConnect</Typography>
          {renderUserSection()}
        </Toolbar>
      </AppBar>
    </NavBarContainer>
  );
}
