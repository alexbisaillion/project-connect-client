import React from "react";
import styled from "styled-components";
import { CircularProgress, Container, CssBaseline, LinearProgress, Typography } from "@material-ui/core";

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
    <Typography variant="h4">{props.textContent}</Typography>
  );
}

export const Attribute = (props: TextProps) => {
  return (
    <Typography variant="h6">{props.textContent}</Typography>
  );
}

