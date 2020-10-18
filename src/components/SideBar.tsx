import React from "react";
import CreateIcon from '@material-ui/icons/Create';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";
import { SearchControl, SearchIconType } from "./commonComponents";

type SideBarProps = {
  isOpen: boolean;
  onChange: () => void;
}
export const SideBar = (props: SideBarProps) => {
  const { isOpen, onChange } = props;
  const [userSearchTerm, setUserSearchTerm] = React.useState<string>("");
  const [projectSearchTerm, setProjectSearchTerm] = React.useState<string>("");

  const list = () => {
    return (
      <div
        role="presentation"
      >
        <List>
          <ListItem button component={Link} to="/" onClick={onChange}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
          <ListItem button component={Link} to="/createProject" onClick={onChange}>
            <ListItemIcon><CreateIcon /></ListItemIcon>
            <ListItemText primary={"Start a new project"} />
          </ListItem>
          <ListItem button component={Link} to="/users" onClick={onChange}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary={"All Users"} />
          </ListItem>
          <ListItem button component={Link} to="/projects" onClick={onChange}>
            <ListItemIcon><AccountTreeIcon /></ListItemIcon>
            <ListItemText primary={"All Projects"} />
          </ListItem>
          <ListItem>
            <SearchControl
              searchTerm={userSearchTerm}
              onChange={(newSearchTerm: string) => setUserSearchTerm(newSearchTerm)}
              icon={SearchIconType.User}
              dismiss={onChange}
            />
          </ListItem>
          <ListItem>
            <SearchControl
              searchTerm={projectSearchTerm}
              onChange={(newSearchTerm: string) => setProjectSearchTerm(newSearchTerm)}
              icon={SearchIconType.Project}
              dismiss={onChange}
            />
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