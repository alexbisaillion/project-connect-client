import React from "react";
import CreateIcon from '@material-ui/icons/Create';
import HomeIcon from '@material-ui/icons/Home';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";

type SideBarProps = {
  isOpen: boolean;
  onChange: () => void;
}
export const SideBar = (props: SideBarProps) => {
  const { isOpen, onChange } = props;

  const list = () => {
    return (
      <div
        role="presentation"
        onClick={onChange}
        onKeyDown={onChange}
      >
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
          <ListItem button component={Link} to="/createProject">
            <ListItemIcon><CreateIcon /></ListItemIcon>
            <ListItemText primary={"Start a new project"} />
          </ListItem>
        </List>
      </div>
    )
  }
  return (
    <Drawer anchor="left" open={isOpen} onClose={onChange}>
      {list()}
    </Drawer>
  );
}