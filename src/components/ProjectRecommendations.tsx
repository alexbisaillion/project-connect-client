import React from "react";
import { getProjectRecommendationsForUser } from "../api";
import { LoadingIndicator } from './commonComponents';
import { ProjectRecommendationsTable } from "./ProjectRecommendationsTable";

type Props = {
  username: string;
  tableWidth?: string;
}
export const ProjectRecommendations = ({ username, tableWidth }: Props) => {
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
  return <ProjectRecommendationsTable projectScores={recommendedProjects.slice(0, 10)} username={username} tableWidth={tableWidth} />
}