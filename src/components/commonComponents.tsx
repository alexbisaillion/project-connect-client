import React from "react";
import styled from "styled-components";
import { Avatar, Button, Chip, CircularProgress, Container, CssBaseline, IconButton, InputAdornment, LinearProgress, List, ListItem, ListItemAvatar, ListItemText, Paper, Snackbar, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Link } from "react-router-dom";
import PersonIcon from '@material-ui/icons/Person';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import SearchIcon from '@material-ui/icons/Search';
import { getDisplayDate, convertPercentageToColour } from "../utilities";
import { Alert } from "@material-ui/lab";
import CheckIcon from '@material-ui/icons/Check';

type PageContainerProps = {
  children: React.ReactNode;
}
export const PageContainer = (props: PageContainerProps) => {
  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      {props.children}
    </Container>
  );
}

const LoadingIndicatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  justify-content: center;
  align-items: center;
`;
export const LoadingIndicator = () => {
  return (
    <LoadingIndicatorContainer>
      <CircularProgress size={100}/>
    </LoadingIndicatorContainer>
  );
}

type TextProps = {
  textContent: string;
  alignment?: "left" | "right" | "center";
  size?: "h3" | "h6" | "h5" | "subtitle1";
}
export const PageHeader = (props: TextProps) => {
  return (
    <Typography
      variant={props.size ? props.size : "h3"}
      align={props.alignment ? props.alignment : "center"}>
      {props.textContent}
    </Typography>
  );
}

const StyledAvatar = styled(Avatar)`
  > .MuiAvatar-colorDefault {
    color: white;
  }
`
type AttributeProps = {
  name?: string;
  value: string;
  avatar?: boolean;
};
export const Attribute = (props: AttributeProps) => {
  return (
    <ListItem>
      {props.avatar &&
        <ListItemAvatar><StyledAvatar>{props.value.charAt(0).toUpperCase()}</StyledAvatar></ListItemAvatar>
      }
      <ListItemText primary={props.value} secondary={props.name} />
    </ListItem>
  );
}

type AttributeListProps = {
  title: string;
  dense?: boolean;
  children: React.ReactNode;
}
export const AttributeList = (props: AttributeListProps) => {
  return (
    <List dense={props.dense ? props.dense : false}>
      <Typography variant={props.dense ? "subtitle1" : "h5"} align="center">{props.title}</Typography>
      {props.children}
    </List>
  );
}

type PanelProps = {
  children: React.ReactNode;
}
const StyledPaper = styled(Paper)`
  && {
    padding: 16px;
  }
`;
export const Panel = (props: PanelProps) => {
  return (
    <StyledPaper elevation={3}>
      {props.children}
    </StyledPaper>
  );
};

const SkillBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  && > * {
    margin: 4px;
  }
`;
type WeightedSkillListProps = {
  skills: Skill[];
  viewingUser?: string;
  vote?: (skill: string) => Promise<void>;
}
export const WeightedSkillList = (props: WeightedSkillListProps) => {
  return (
    <SkillBox>
      {props.skills.map((skill) => {
        const isAlreadyVoted: boolean = !!props.viewingUser && skill.votes.includes(props.viewingUser);
        return (
          <Chip
            avatar={<Avatar>{skill.votes.length}</Avatar>}
            key={skill.name}
            label={skill.name}
            color="primary"
            disabled={isAlreadyVoted}
            onClick={props.vote ? () => props.vote && props.vote(skill.name) : undefined}
            onDelete={isAlreadyVoted ? () => {} : undefined} /* Only used to get the icon to show up*/
            deleteIcon={isAlreadyVoted ? <CheckIcon /> : undefined}
          />
        )
      })}
    </SkillBox>
  )
}
type SkillListProps = {
  skills: string[];
  onDelete?: (value: string) => void;
}
export const SkillList = (props: SkillListProps) => {
  return (
    <SkillBox>
      {props.skills.map((skill) => {
        return (
          <Chip
            key={skill}
            label={skill}
            onDelete={props.onDelete ? () => props.onDelete && props.onDelete(skill) : undefined}
            color="primary"
          />
        )
      })}
    </SkillBox>
  )
}

type AttributeDropdownProps = {
  name: string;
  options: string[];
  onChange: (newValue: string) => void;
}
export const AttributeDropdown = (props: AttributeDropdownProps) => {
  return (
    <Autocomplete
      fullWidth
      options={props.options}
      onChange={(_event, option: string | null) => {
        if (option) {
          props.onChange(option);
        }
      }}
      renderInput={(params) => <TextField {...params} label={props.name} variant="outlined" />}
    />
  )
}

type TextControlProps = {
  name: string;
  value: string;
  onChange: (newValue: string) => void;
  large?: boolean;
}
export const TextControl = (props: TextControlProps) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={props.name}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      error={props.value.length <= 0}
      multiline={props.large}
      rows={props.large ? 10 : undefined}
      rowsMax={props.large ? 10 : undefined}
      inputProps={{ spellCheck: false }}
    />
  )
}

type ApplyButtonProps = {
  name: string;
  onApply: () => void;
  disabled?: boolean;
  color?: "primary" | "secondary";
  fullWidth?: boolean;
}
export const ApplyButton = (props: ApplyButtonProps) => {
  return (
    <Button
      style={{ marginLeft: props.color === "secondary" && !props.fullWidth ? "8px" : undefined}}
      fullWidth={props.fullWidth ?? true}
      variant="contained"
      color={props.color ? props.color : "primary"}
      onClick={props.onApply}
      disabled={props.disabled}
    >
      {props.name}
    </Button>
  )
}

type LinkButtonProps = {
  link: string;
  name: string;
}
export const LinkButton = (props: LinkButtonProps) => {
  return (
    <Button component={ Link } to={props.link} fullWidth variant="contained" color="primary">
      {props.name}
    </Button>
  );
}

export enum SearchIconType {
  User, Project
}
type SearchControlProps = {
  searchTerm: string;
  onChange: (newSearchTerm: string) => void;
  icon: SearchIconType;
  dismiss?: () => void;
}
export const SearchControl = (props: SearchControlProps) => {
  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        value={props.searchTerm}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.icon === SearchIconType.User ? "Search users" : "Search projects"}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {props.icon === SearchIconType.User ? <PersonIcon /> : <AccountTreeIcon /> }
            </InputAdornment>
          ),
        }}
      />
      <IconButton
        color="inherit"
        component={Link}
        to={`/search?type=${props.icon === SearchIconType.User ? "user" : "project"}&term=${props.searchTerm}`}
        onClick={props.dismiss}
        disabled={props.searchTerm.length <= 0}
      >
        <SearchIcon />
      </IconButton>
    </>
  )
}

// Material ui TableCell component prop does not work with react router Link component
// Incompatible props...
export const StyledLink = styled(Link)`
  color: white
`;
type ItemAction = {
  action: (item: string) => Promise<boolean>;
  checkDisabled: (item: string) => boolean;
  enabledButtonLabel: string;
  disabledButtonLabel: string;
  successMessage: string;
  failureMessage: string;
}
type SearchResultsTableProps = {
  userData?: IUser[];
  projectData?: IProject[];
  dataType: "user" | "project";
  acceptAction?: ItemAction;
  rejectAction?: ItemAction;
}
export const SearchResultsTable = (props: SearchResultsTableProps) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<boolean>(false);
  const [isActionSuccessful, setIsActionSuccessful] = React.useState<boolean>(false);

  const executeAcceptAction = async (item: string) => {
    if (!props.acceptAction) {
      return;
    }
    const result = await props.acceptAction.action(item);
    setIsSnackbarOpen(true);
    setIsActionSuccessful(result);
  }

  const executeRejectAction = async (item: string) => {
    if (!props.rejectAction) {
      return;
    }

    const result = await props.rejectAction.action(item);
    setIsSnackbarOpen(true);
    setIsActionSuccessful(result);
  }

  const renderAcceptSnackbar = () => {
    if (!props.acceptAction) {
      return;
    }
    return (
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSnackbarOpen(false)}>
        <Alert variant="filled" onClose={() => setIsSnackbarOpen(false)} severity={isActionSuccessful ? "success" : "error"}>
          {isActionSuccessful ? props.acceptAction.successMessage : props.acceptAction.failureMessage }
        </Alert>
      </Snackbar>
    );
  }

  const renderRejectSnackbar = () => {
    if (!props.rejectAction) {
      return;
    }
    return (
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSnackbarOpen(false)}>
        <Alert variant="filled" onClose={() => setIsSnackbarOpen(false)} severity={isActionSuccessful ? "success" : "error"}>
          {isActionSuccessful ? props.rejectAction.successMessage : props.rejectAction.failureMessage }
        </Alert>
      </Snackbar>
    );
  }

  const getProjectsHeader = () => {
    return (
      <TableHead>
        <TableRow>
          {["Name", "Creator", "Start Date", "In Progress"].map(header => {
            return (
              <TableCell key={header} align="right">{header}</TableCell>
            );
          })}
          {(props.acceptAction || props.rejectAction) &&
            <TableCell align="right">Action</TableCell>
          }
        </TableRow>
      </TableHead>
    );
  }
  const getProjectsBody = (projects: IProject[]) => {
    return (
      <TableBody>
        {projects.map((project: IProject) => {
          return (
            <TableRow key={project.name}>
              <TableCell align="right">
                <StyledLink to={`/project/${project.name}`}>{project.name}</StyledLink>
              </TableCell>
              <TableCell align="right">
                <StyledLink to={`/user/${project.creator}`}>{project.creator}</StyledLink>
              </TableCell>
              {[getDisplayDate(project.startDate), project.isInProgress === true ? "True" : "False"].map(attribute => {
                  return (
                    <TableCell align="right" key={project.name + "-" + attribute}>{attribute}</TableCell>
                  );
              })}
              {(props.acceptAction || props.rejectAction) &&
                <TableCell align="right">
                  {props.acceptAction && 
                    <ApplyButton
                      fullWidth={false}
                      disabled={props.acceptAction.checkDisabled(project.name)}
                      name={props.acceptAction.checkDisabled(project.name) ? props.acceptAction.disabledButtonLabel : props.acceptAction.enabledButtonLabel}
                      onApply={() => executeAcceptAction(project.name)}
                    />
                  }
                  {props.rejectAction &&
                    <ApplyButton
                      fullWidth={false}
                      disabled={props.rejectAction.checkDisabled(project.name)}
                      name={props.rejectAction.checkDisabled(project.name) ? props.rejectAction.disabledButtonLabel : props.rejectAction.enabledButtonLabel}
                      onApply={() => executeRejectAction(project.name)}
                      color="secondary"
                    />
                  }
                </TableCell>
              }
            </TableRow>
          )
        })}
      </TableBody>
    );
  }

  const getUsersHeader = () => {
    return (
      <TableHead>
        <TableRow>
          {["Name", "Region", "Position", "Industry"].map(header => {
            return (
              <TableCell key={header} align="right">{header}</TableCell>
            );
          })}
          {(props.acceptAction || props.rejectAction) &&
            <TableCell align="right">Action</TableCell>
          }
        </TableRow>
      </TableHead>
    )
  }
  const getUsersBody = (users: IUser[]) => {
    return (
      <TableBody>
        {users.map((user: IUser) => {
          return (
            <TableRow key={user.username}>
              <TableCell align="right">
                <StyledLink to={`/user/${user.username}`}>{user.name}</StyledLink>
              </TableCell>
              {[
                user.region,
                user.currentEmployment.position + " at " + user.currentEmployment.company,
                user.industry
              ].map(attribute => {
                  return (
                    <TableCell align="right" key={user.username + "-" + attribute}>{attribute}</TableCell>
                  );
              })}
              {(props.acceptAction || props.rejectAction) &&
                <TableCell align="right">
                  {props.acceptAction &&
                    <ApplyButton
                      fullWidth={false}
                      disabled={props.acceptAction.checkDisabled(user.username)}
                      name={props.acceptAction.checkDisabled(user.username) ? props.acceptAction.disabledButtonLabel : props.acceptAction.enabledButtonLabel}
                      onApply={() => executeAcceptAction(user.username)}
                    />
                  }
                  {props.rejectAction &&
                    <ApplyButton
                      fullWidth={false}
                      disabled={props.rejectAction.checkDisabled(user.username)}
                      name={props.rejectAction.checkDisabled(user.username) ? props.rejectAction.disabledButtonLabel : props.rejectAction.enabledButtonLabel}
                      onApply={() => executeRejectAction(user.username)}
                      color="secondary"
                    />
                  }
                </TableCell>
              }
            </TableRow>
          )
        })}
      </TableBody>
    );
  }

  const getContent = () => {
    if (props.dataType.toLowerCase() === "user") {
      return (
        <>
          {getUsersHeader()}
          {getUsersBody(props.userData ?? [])}
        </>
      );
    }
    return (
      <>
        {getProjectsHeader()}
        {getProjectsBody(props.projectData ?? [])}
      </>
    );
  }

  return (
    <>
      {renderAcceptSnackbar()}
      {renderRejectSnackbar()}
      <TableContainer style={{ width: "auto"}} component={Paper}>
        {getContent()}
      </TableContainer>
    </>
  );
}

const StyledUserAvatar = styled(Avatar)`
  && {
    color: white;
    height: 225px;
    width: 225px;
    font-size: 100px;
    background-color: #009688;
  }
`
type UserAvatarProps = {
  large?: boolean;
  name: string;
}
export const UserAvatar = (props: UserAvatarProps) => {
  const names = props.name.toUpperCase().split(" ");
  const initial = names[0].charAt(0) + (names[1] !== undefined ? names[1].charAt(0) : "");
  return (
    <StyledUserAvatar>{initial}</StyledUserAvatar>
  );
}

const StyledLinearProgress = styled(LinearProgress)<CompatibilityBarProps>`
  && {
    background-color: #424242;
    && > .MuiLinearProgress-barColorPrimary {
      background-color: ${props => convertPercentageToColour(props.score)};
    }
  }
`
type CompatibilityBarProps = {
  score: number;
}
export const CompatibilityBar = (props: CompatibilityBarProps) => {
  return (
    <StyledLinearProgress
      variant="determinate"
      value={props.score * 100}
      score={props.score}
    />
  );
}