import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { LoadingIndicator, PageContainer, PageHeader, SearchResultsTable } from "../commonComponents";
import { getProjects, getUsers } from "../../api";

const SearchResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 8px;
  }
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const SearchResults = () => {
  const query = useQuery();
  const type = query.get("type") || "";
  const term = query.get("term") || "";
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [userResults, setUserResults] = React.useState<IUser[]>([]);
  const [projectResults, setProjectResults] = React.useState<IProject[]>([]);

  React.useEffect(() => {
    const fetchUsers = async (term: string) => {
      const fetchedUsers = await getUsers();
      setUserResults(fetchedUsers.data.filter(user => user.name.toLowerCase().startsWith(term.toLowerCase()) || user.username.toLowerCase().startsWith(term.toLowerCase())));
      setIsSearching(false);
    }
    const fetchProjects = async (term: string) => {
      const fetchedProjects = await getProjects();
      setProjectResults(fetchedProjects.data.filter(project => project.name.toLowerCase().startsWith(term.toLowerCase())));
    }

    if (type.toLowerCase() === "user") {
      fetchUsers(term);
    } else if (type.toLowerCase() === "project") {
      fetchProjects(term);
    }
  }, [type, term]);

  const renderResults = () => {
    if (type === "user" && userResults.length > 0) {
      return <SearchResultsTable userData={userResults} dataType="user" />
    } else if (type === "project" && projectResults.length > 0) {
      return <SearchResultsTable projectData={projectResults} dataType="project" />
    } else {
      return <><p>No results</p></>
    }
  }

  const getContent = () => {
    if (isSearching) {
      return <LoadingIndicator />
    }
    return (
      <SearchResultsContainer>
        <PageHeader textContent={type === "user" ? "User Search Results" : "Project Search Results"} />
        {renderResults()}
      </SearchResultsContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
}