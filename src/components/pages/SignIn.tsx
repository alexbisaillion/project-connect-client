import React from "react";
import styled from "styled-components";
import { Button, Snackbar, TextField, Typography } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { authenticationManager } from "../../authenticationManager";
import { PageContainer } from "../commonComponents";
import { Alert } from "@material-ui/lab";

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  justify-content: space-around;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: white;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  && > * {
    margin: 8px;
  }
`;

export const SignIn = () => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [successfulLogin, setSuccessfulLogin] = React.useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<boolean>(false);

  const attemptLogin = async () => {
    try {
      await authenticationManager.attemptLogIn(username, password);
      setSuccessfulLogin(authenticationManager.getIsLoggedIn());  
    } catch (_e) {
      setSuccessfulLogin(false);
      setIsSnackbarOpen(true);
    }
  };

  const renderSnackbar = () => {
    return (
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSnackbarOpen(false)}>
        <Alert variant="filled" onClose={() => setIsSnackbarOpen(false)} severity={"error"}>Failed to sign in.</Alert>
      </Snackbar>
    );
  }

  if (successfulLogin) {
    return <Redirect to={`/`} />
  } else {
    return (
      <>
        {renderSnackbar()}
        <PageContainer>
          <SignInContainer>
            <Typography component="h1" variant="h5">Sign in</Typography>
            <StyledForm
              onSubmit={(e) => {
                e.preventDefault();
                attemptLogin();
              }}
            >
              <TextField fullWidth variant="outlined" label="Username" name="username" autoFocus onChange={(e => setUsername(e.target.value))}/>
              <TextField fullWidth variant="outlined" label="Password" name="password" type="password" onChange={(e => setPassword(e.target.value))}/>
              <Button fullWidth variant="contained" color="primary" type="submit" onClick={() => attemptLogin()}>Sign in</Button>
            </StyledForm>
            <StyledLink to="/register">Don't have an account? Register here.</StyledLink>
          </SignInContainer>
        </PageContainer>
      </>
    );
  }
}