import React from "react";
import styled from "styled-components";
import { getUser } from "../../api";
import { authenticationManager } from "../../authenticationManager";
import { LinkButton, LoadingIndicator, PageContainer, PageHeader } from "../commonComponents";
import { ProjectRecommendations } from "../ProjectRecommendations";
import { ProjectFeed } from "../ProjectFeed";
import { NotificationFeed } from "../NotificationFeed";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  && > * {
    margin: 8px;
  }
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

type ColumnContainerProps = {
  columnWidth: string;
}
const ColumnContainer = styled.div<ColumnContainerProps>`
  display: flex;
  flex-direction: column;
  width: ${props => props.columnWidth};
  align-items: center;
  && > * {
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
      content = <>
        <PageHeader textContent={"Welcome, " + currentUser.name + "!"} />
        <NotificationFeed user={currentUser} />
        <RowContainer>
          <ColumnContainer columnWidth="45%">
            <PageHeader size="h5" textContent="Latest Projects" />
            <ProjectFeed username={currentUser.username} tableWidth="100%" />
          </ColumnContainer>
          <ColumnContainer columnWidth="45%">
            <PageHeader size="h5" textContent="Your Recommendations" />
            <ProjectRecommendations username={currentUser.username} tableWidth="100%" />
          </ColumnContainer>
        </RowContainer>
      </>;
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