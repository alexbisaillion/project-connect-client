import React from 'react';
import { AppBar, Button, createStyles, IconButton, makeStyles, Theme, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { authenticationManager } from '../authenticationManager';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  }),
);

type NavBarProps = {
  menuOnClick: () => void;
}
export const NavBar = (props: NavBarProps) => {
  const classes = useStyles();

  const attemptLogout = async () => {
    await authenticationManager.attemptLogout();
    window.location.reload();
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={props.menuOnClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>ProjectConnect</Typography>
          {authenticationManager.getIsLoggedIn() &&
            <Button color="inherit" onClick={() => attemptLogout()}>Logout</Button>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}
