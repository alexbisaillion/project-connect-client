import { Paper, Snackbar, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import { inviteToProject } from "../api";
import { ApplyButton, CompatibilityBar, StyledLink } from "./commonComponents";

type ProjectRecommendationsTableProps = {
  userScores: UserScore[];
  project: string;
}
export const UserRecommendationsTable = (props: ProjectRecommendationsTableProps) => {
  const { project } = props;
  const [loadedUserScores, setLoadedUserScores] = React.useState<UserScore[]>(props.userScores);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<boolean>(false);
  const [isRequestSuccessful, setIsRequestSuccessful] = React.useState<boolean>(false);

  const renderSnackbar = () => {
    return (
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSnackbarOpen(false)}>
        <Alert variant="filled" onClose={() => setIsSnackbarOpen(false)} severity={isRequestSuccessful ? "success" : "error"}>
          {isRequestSuccessful ? "Invite sent!" : "Failed to send invite." }
        </Alert>
      </Snackbar>
    );
  }

  const sendInvite = async (userScore: UserScore) => {
    const result = await inviteToProject(userScore.user.username, project);
    if (result.data) {
      const loadedUserScoresCopy = loadedUserScores;
      const userIndex = loadedUserScores.indexOf(userScore);
      if (userIndex !== -1) {
        loadedUserScoresCopy[userIndex] = { user: result.data, score: userScore.score };
        setLoadedUserScores([...loadedUserScoresCopy]); 
        setIsRequestSuccessful(true);
        setIsSnackbarOpen(true);
        return;
      }
    }
    setIsRequestSuccessful(false);
    setIsSnackbarOpen(false); 
  }

  return (
    <>
      {renderSnackbar()}
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
          {loadedUserScores.map((userScore: UserScore) => {
            return (
              <TableRow key={userScore.user.username}>
                <TableCell align="right">
                  <StyledLink to={`/user/${userScore.user.username}`}>{userScore.user.name}</StyledLink>
                </TableCell>
                <TableCell align="right"><CompatibilityBar score={userScore.score} /></TableCell>
                <TableCell align="right"><ApplyButton name="View" onApply={() => {}}/></TableCell>
                <TableCell align="right">
                  <ApplyButton
                    disabled={userScore.user.invitations.includes(project)}
                    name={userScore.user.invitations.includes(project) ? "Invite sent" : "Invite"}
                    onApply={() => sendInvite(userScore)}
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
