import React from 'react';
import { AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

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

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={props.menuOnClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">ProjectConnect</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
