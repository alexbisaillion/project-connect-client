import { Paper, Snackbar, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import { requestToJoinProject } from "../api";
import { ApplyButton, CompatibilityBar, StyledLink } from "./commonComponents";
import { CompatibilityDialog } from "./CompatibilityDialog";

type RecommendationsTableProps = {
  projectScores: ProjectScore[];
  username: string;
  tableWidth?: string;
}
export const ProjectRecommendationsTable = (props: RecommendationsTableProps) => {
  const { username, tableWidth } = props;
  const [loadedProjectScores, setLoadedProjectScores] = React.useState<ProjectScore[]>(props.projectScores);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<boolean>(false);
  const [isRequestSuccessful, setIsRequestSuccessful] = React.useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [selectedProject, setSelectedProject] = React.useState<ProjectScore | undefined>();

  const renderSnackbar = () => {
    return (
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSnackbarOpen(false)}>
        <Alert variant="filled" onClose={() => setIsSnackbarOpen(false)} severity={isRequestSuccessful ? "success" : "error"}>
          {isRequestSuccessful ? "Request sent!" : "Failed to send request." }
        </Alert>
      </Snackbar>
    );
  }

  const sendJoinRequest = async (projectScore: ProjectScore) => {
    const result = await requestToJoinProject(username, projectScore.project.name);
    if (result.data) {
      const loadedProjectScoresCopy = loadedProjectScores;
      const projectIndex = loadedProjectScores.indexOf(projectScore);
      if (projectIndex !== -1) {
        loadedProjectScoresCopy[projectIndex] = { project: result.data, score: projectScore.score };
        setLoadedProjectScores([...loadedProjectScoresCopy]); 
        setIsRequestSuccessful(true);
        setIsSnackbarOpen(true);
        return;
      }
    }
    setIsRequestSuccessful(false);
    setIsSnackbarOpen(false); 
  }

  console.log(tableWidth);
  return (
    <>
      {renderSnackbar()}
      {selectedProject &&
        <CompatibilityDialog
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
          project={selectedProject.project.name}
          username={username}
          score={selectedProject.score}
        />
      }
      <TableContainer style={{ width: tableWidth ? tableWidth : "auto"}} component={Paper}>
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
                <TableCell align="right">
                  <ApplyButton
                    name="View"
                    onApply={() => {
                      setSelectedProject(projectScore);
                      setIsDialogOpen(true);
                    }}
                  />
                </TableCell>
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
    </>
  );
}
