import React from "react";
import styled from "styled-components";
import { getUser } from "../../api";
import { authenticationManager } from "../../authenticationManager";
import { LinkButton, LoadingIndicator, PageContainer, PageHeader } from "../commonComponents";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 8px;
  }
`;

export const Home = () => {
  const isLoggedIn = authenticationManager.getIsLoggedIn();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [currentUser, setCurrentUser] = React.useState<IUser | undefined>();

  React.useEffect(() => {
    const fetchUser = async (username: string) => {
      const fetchedUser = await getUser(username);
      setCurrentUser(fetchedUser.data);
      setIsLoading(false);
    }

    if (isLoggedIn) {
      const username = authenticationManager.getLoggedInUser();
      if (username.length > 0) {
        fetchUser(username);
        return;
      }
    }
    setIsLoading(false);
  }, [isLoggedIn])

  const getContent = () => {
    if (isLoading) {
      return <LoadingIndicator />
    }

    let content;
    if (currentUser) {
      content = <PageHeader textContent={"Welcome, " + currentUser.name + "!"} />;
    } else {
      content = <>
        <PageHeader textContent={"Welcome to ProjectConnect!"} />
        <LinkButton name="Sign In" link="/login" />
        <LinkButton name="Register" link="/register" />
      </>;
    }

    return (
      <HomeContainer>
        {content}
      </HomeContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
}