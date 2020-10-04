import React from "react";
import styled from "styled-components";
import { Avatar, Chip, CircularProgress, Container, CssBaseline, List, ListItem, ListItemText, Paper, Typography } from "@material-ui/core";

type PageContainerProps = {
  children: React.ReactNode;
}
export const PageContainer = (props: PageContainerProps) => {
  return (
    <Container component="main" maxWidth="xs">
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
    <Typography variant="h3">{props.textContent}</Typography>
  );
}

type AttributeProps = {
  name?: string;
  value: string;
};
export const Attribute = (props: AttributeProps) => {
  return (
    <ListItem>
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
      <Typography variant={props.dense ? "h6" : "h4"}>{props.title}</Typography>
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

type SkillListProps = {
  skills: Skill[];
}
const SkillBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  > * {
    margin: 4px;
  }
`;
export const SkillList = (props: SkillListProps) => {
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
