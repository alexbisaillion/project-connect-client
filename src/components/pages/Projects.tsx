import React from "react";
import styled from "styled-components";
import { LoadingIndicator, PageContainer, PageHeader, SearchResultsTable } from "../commonComponents";
import { getProjects } from "../../api";

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 8px;
  }
`;

export const Projects = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [projectResults, setProjectResults] = React.useState<IProject[]>([]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      const fetchedProjects = await getProjects();
      setProjectResults(fetchedProjects.data);
      setIsLoading(false);
    }
    
    fetchProjects();
  }, []);

  const renderResults = () => {
    if (projectResults.length > 0) {
      return <SearchResultsTable projectData={projectResults} dataType="project" />
    } else {
      return <><p>No results</p></>
    }
  }

  const getContent = () => {
    if (isLoading) {
      return <LoadingIndicator />
    }
    return (
      <ProjectsContainer>
        <PageHeader textContent={"All Projects"} />
        {renderResults()}
      </ProjectsContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
}