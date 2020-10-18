import React from "react";
import styled from "styled-components";
import { LoadingIndicator, PageContainer, PageHeader, SearchResultsTable } from "../commonComponents";
import { getUsers } from "../../api";

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 8px;
  }
`;

export const Users = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [userResults, setUserResults] = React.useState<IUser[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUserResults(fetchedUsers.data);
      setIsLoading(false);
    }
    
    fetchUsers();
  }, []);

  const renderResults = () => {
    if (userResults.length > 0) {
      return <SearchResultsTable userData={userResults} dataType="user" />
    } else {
      return <><p>No results</p></>
    }
  }

  const getContent = () => {
    if (isLoading) {
      return <LoadingIndicator />
    }
    return (
      <UsersContainer>
        <PageHeader textContent={"All Users"} />
        {renderResults()}
      </UsersContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
}