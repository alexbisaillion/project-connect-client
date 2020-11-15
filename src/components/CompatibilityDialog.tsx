import { Dialog, DialogContent, DialogTitle, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { getProject, getUser } from "../api";

const TableRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
`;

const StyledTableCell = styled(TableCell)`
  & {
    padding: 8px;
  }
`;

type CompatibilityDialogProps = {
  open: boolean;
  onClose: () => void;
  score: number;
  username: string;
  project: string;
}
export const CompatibilityDialog = (props: CompatibilityDialogProps) => {
  const { open, onClose, username, project } = props;
  const [loadedUser, setLoadedUser] = React.useState<IUser>();
  const [loadedProject, setLoadedProject] = React.useState<IProject>();

  React.useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser(username);
      setLoadedUser(fetchedUser.data);
    }
    fetchUser();
  }, [username]);

  React.useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getProject(project);
      setLoadedProject(fetchedProject.data);
    }
    fetchProject();
  }, [project]);

  const renderInterestsTable = () => {
    if (!loadedUser || !loadedProject) {
      return;
    }
    const allInterests = [...loadedProject.skills, ...(loadedUser.skills.map(skill => skill.name).filter(skill => !loadedProject.skills.includes(skill)))];

    return (
      <CompatibilityTable 
        header1={loadedUser.name}
        header2={loadedProject.name}
        rows={allInterests}
        header1Values={loadedUser.skills.map(skill => skill.name)}
        header2Values={loadedProject.skills}
      />
    );
  }

  const renderProgrammingLanguagesTable = () => {
    if (!loadedUser || !loadedProject) {
      return;
    }
    const allProgrammingLanguages = [
      ...loadedProject.programmingLanguages,
      ...(loadedUser.programmingLanguages.map(pl => pl.name).filter(pl => !loadedProject.programmingLanguages.includes(pl)))
    ];

    return (
      <CompatibilityTable 
        header1={loadedUser.name}
        header2={loadedProject.name}
        rows={allProgrammingLanguages}
        header1Values={loadedUser.programmingLanguages.map(pl => pl.name)}
        header2Values={loadedProject.programmingLanguages}
      />
    );
  }

  const renderFrameworksTable = () => {
    if (!loadedUser || !loadedProject) {
      return;
    }
    const allFrameworks = [
      ...loadedProject.frameworks,
      ...(loadedUser.frameworks.map(framework => framework.name).filter(framework => !loadedProject.frameworks.includes(framework)))
    ];

    return (
      <CompatibilityTable 
        header1={loadedUser.name}
        header2={loadedProject.name}
        rows={allFrameworks}
        header1Values={loadedUser.frameworks.map(framework => framework.name)}
        header2Values={loadedProject.frameworks}
      />
    );
  }

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="lg">
      <DialogTitle>Compatibility Details</DialogTitle>
      <DialogContent>
        <TableRowContainer>
          {renderInterestsTable()}
          {renderProgrammingLanguagesTable()}
          {renderFrameworksTable()}
        </TableRowContainer>
      </DialogContent>
    </Dialog>
  );
}

type CompatibilityTableProps = {
  header1: string;
  header2: string;
  rows: string[];
  header1Values: string[];
  header2Values: string[];
}
const CompatibilityTable = (props: CompatibilityTableProps) => {
  const { header1, header2, rows, header1Values, header2Values} = props;

  return (
    <TableContainer style={{ width: "auto"}}>
      <TableHead>
        <TableRow>
          <StyledTableCell />
          <StyledTableCell>{header1}</StyledTableCell>
          <StyledTableCell>{header2}</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(attribute => {
          return (
            <TableRow>
              <StyledTableCell>{attribute}</StyledTableCell>
              <StyledTableCell>{header1Values.includes(attribute) ? "✔️" : "❌"}</StyledTableCell>
              <StyledTableCell>{header2Values.includes(attribute) ? "✔️" : "❌"}</StyledTableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </TableContainer>
  );
}