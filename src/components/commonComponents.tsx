import React from "react";
import { Container, CssBaseline, Typography } from "@material-ui/core";

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

