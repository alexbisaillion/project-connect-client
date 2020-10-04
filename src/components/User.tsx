import React from "react";
import styled from "styled-components";
import { getUser } from "../api";
import { RouteComponentProps } from 'react-router-dom'
import { PageHeader, Attribute, PageContainer, LoadingIndicator } from "./commonComponents";

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 8px;
  }
`;

interface UserInfo { username: string; }

interface ComponentProps extends RouteComponentProps<UserInfo> {}

export const User = (props: ComponentProps) => {
  const { username } = props.match.params;
  const [loadedUser, setLoadedUser] = React.useState<IUser | undefined>(undefined);

  React.useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser(username);
      setLoadedUser(fetchedUser.data);
    }
    fetchUser();
  }, [username]);

  const getContent = () => {
    if (!loadedUser) {
      return <LoadingIndicator />
    }
    return (
      <UserContainer>
        <PageHeader textContent={loadedUser.name} />
        <Attribute textContent={loadedUser.currentEmployment.position} />
        <Attribute textContent={loadedUser.region} />
      </UserContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
};