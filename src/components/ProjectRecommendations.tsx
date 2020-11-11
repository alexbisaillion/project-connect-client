import { TableHead, TableRow } from "@material-ui/core";
import React from "react";
import { getProjectRecommendationsForUser } from "../api";
import { LoadingIndicator, SearchResultsTable } from './commonComponents';

type Props = {
  username: string;
}
export const ProjectRecommendations = ({ username }: Props) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [recommendedProjects, setRecommendedProjects] = React.useState<ProjectScore[]>([]);

  React.useEffect(() => {
    const getRecommendations = async () => {
      const result = await getProjectRecommendationsForUser(username);
      setRecommendedProjects(result.data);
      setIsLoading(false);
    }
    getRecommendations();
  }, [username]);

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return <SearchResultsTable projectData={recommendedProjects.slice(0, 10).map(p => p.project)} dataType="project" />
}