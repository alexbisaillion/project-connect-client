import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import { requestToJoinProject } from "../api";
import { ApplyButton, CompatibilityBar, StyledLink } from "./commonComponents";

type RecommendationsTableProps = {
  projectScores: ProjectScore[];
  username: string;
}
export const ProjectRecommendationsTable = (props: RecommendationsTableProps) => {
  const { username } = props;
  const [loadedProjectScores, setLoadedProjectScores] = React.useState<ProjectScore[]>(props.projectScores);

  const sendJoinRequest = async (projectScore: ProjectScore) => {
    const result = await requestToJoinProject(username, projectScore.project.name);
    if (result.data) {
      const loadedProjectScoresCopy = loadedProjectScores;
      const projectIndex = loadedProjectScores.indexOf(projectScore);
      if (projectIndex !== -1) {
        loadedProjectScoresCopy[projectIndex] = { project: result.data, score: projectScore.score };
        setLoadedProjectScores([...loadedProjectScoresCopy]);  
      }
    }
  }

  return (
    <TableContainer style={{ width: "auto"}} component={Paper}>
      <TableHead>
        <TableRow>
          {["Name", "Compatibility", "Details", "Options"].map(header => {
            return (
              <TableCell key={header} align="right">{header}</TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {loadedProjectScores.map((projectScore: ProjectScore) => {
          return (
            <TableRow key={projectScore.project.name}>
              <TableCell align="right">
                <StyledLink to={`/project/${projectScore.project.name}`}>{projectScore.project.name}</StyledLink>
              </TableCell>
              <TableCell align="right"><CompatibilityBar score={projectScore.score} /></TableCell>
              <TableCell align="right"><ApplyButton name="View" onApply={() => {}}/></TableCell>
              <TableCell align="right">
                <ApplyButton
                  disabled={projectScore.project.requests.includes(username)}
                  name={projectScore.project.requests.includes(username) ? "Request sent" : "Request to join"}
                  onApply={() => sendJoinRequest(projectScore)}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </TableContainer>
  );
}
