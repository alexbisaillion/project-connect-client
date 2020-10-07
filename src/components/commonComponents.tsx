import React from "react";
import styled from "styled-components";
import { Avatar, Button, Chip, CircularProgress, Container, CssBaseline, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Link } from "react-router-dom";

type PageContainerProps = {
  children: React.ReactNode;
}
export const PageContainer = (props: PageContainerProps) => {
  return (
    <Container component="main" maxWidth="md">
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
}
export const PageHeader = (props: TextProps) => {
  return (
    <Typography component="h1" variant="h5" align="center">{props.textContent}</Typography>
  );
}

const StyledAvatar = styled(Avatar)`
  > .MuiAvatar-colorDefault {
    color: white;
    background-color: green;
  }
`
type AttributeProps = {
  name?: string;
  value: string;
  avatar?: boolean;
};
export const Attribute = (props: AttributeProps) => {
  console.log(props);
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
      <Typography component="h1" variant="h6" align="center">{props.title}</Typography>
      {props.children}
    </List>
  );
}

type PanelProps = {
  children: React.ReactNode;
}
const StyledPaper = styled(Paper)`
  > .MuiList-padding {
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
  > * {
    margin: 4px;
  }
`;
type WeightedSkillListProps = {
  skills: Skill[];
}
export const WeightedSkillList = (props: WeightedSkillListProps) => {
  return (
    <SkillBox>
      {props.skills.map((skill) => {
        return (
          <Chip
            avatar={<Avatar>{skill.votes}</Avatar>}
            key={skill.name}
            label={skill.name}
            color="primary"
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
    />
  )
}

type ApplyButtonProps = {
  name: string;
  onApply: () => void;
}
export const ApplyButton = (props: ApplyButtonProps) => {
  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      onClick={props.onApply}
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