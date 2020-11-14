import React from "react";
import { getUserRecommendationsForProject } from "../api";
import { LoadingIndicator } from './commonComponents';
import { UserRecommendationsTable } from "./UserRecommendationsTable";

type Props = {
  project: string;
}
export const UserRecommendations = ({ project }: Props) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [recommendedUsers, setRecommendedUsers] = React.useState<UserScore[]>([]);

  React.useEffect(() => {
    const getRecommendations = async () => {
      const result = await getUserRecommendationsForProject(project);
      setRecommendedUsers(result.data);
      setIsLoading(false);
    }
    getRecommendations();
  }, [project]);

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return <UserRecommendationsTable userScores={recommendedUsers.slice(0, 10)} project={project} />
}