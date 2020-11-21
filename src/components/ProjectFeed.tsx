import React from "react";
import { getMostRecentProjects } from "../api";
import { LoadingIndicator } from './commonComponents';
import { ProjectRecommendationsTable } from "./ProjectRecommendationsTable";

type Props = {
  username: string;
  tableWidth?: string;
}
export const ProjectFeed = ({ username, tableWidth }: Props) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [newestProjects, setNewestProjects] = React.useState<ProjectScore[]>([]);

  React.useEffect(() => {
    const getRecentProjects = async () => {
      const result = await getMostRecentProjects(username);
      setNewestProjects(result.data);
      setIsLoading(false);
    }
    getRecentProjects();
  }, [username]);

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return <ProjectRecommendationsTable projectScores={newestProjects} username={username} tableWidth={tableWidth} />
}