import { Chip, Dialog, DialogContent, DialogTitle, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { getProject, getUser, getUsersByUsernames } from "../api";

// Copied from server
const getMostCommonAttribute = (attributes: string[]) => attributes.sort(
  (a, b) => attributes.filter(v => v === a).length - attributes.filter(v => v === b).length
).pop();

// Copied from server
const getAverageAttribute = (attributes: number[]) => attributes.reduce((a, b) => (a + b)) / attributes.length;

const TableRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 16px;
`;

const AttributeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  && > * {
    margin: 4px;
  }
`;

const StyledTableCell = styled(TableCell)`
  && {
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
  const [projectUsers, setProjectUsers] = React.useState<IUser[]>([]);

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

  React.useEffect(() => {
    const fetchUsers = async (usernames: string[]) => {
      if (usernames.length > 0) {
        const users = await getUsersByUsernames(usernames);
        setProjectUsers([...users.data]);  
      } else {
        setProjectUsers([]);
      }
    }
    if (loadedProject) {
      fetchUsers(loadedProject.users);
    } 
  }, [loadedProject]);
  
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

  const renderEducationSimilarity = () => {
    if (!loadedUser || !loadedProject || projectUsers.length < 1) {
      return;
    }
    const mostCommonEducation = getMostCommonAttribute(projectUsers.map(user => user.education));

    return (
      <AttributeBox>
        <Typography>Education</Typography>
        <Typography>{loadedUser.education === mostCommonEducation ? "✔️" : "❌"}</Typography>
        <RowContainer>
          <Typography>{`${loadedProject.name}:`}</Typography>
          <Chip label={mostCommonEducation} color="primary" />
        </RowContainer>
        <RowContainer>
          <Typography>{`${loadedUser.name}:`}</Typography>
          <Chip label={loadedUser.education} color={loadedUser.education === mostCommonEducation ? "primary" : "secondary"} />
        </RowContainer>
      </AttributeBox>
    );
  }

  const renderRegionSimilarity = () => {
    if (!loadedUser || !loadedProject || projectUsers.length < 1) {
      return;
    }
    const mostCommonRegion = getMostCommonAttribute(projectUsers.map(user => user.region));

    return (
      <AttributeBox>
        <Typography>Region</Typography>
        <Typography>{loadedUser.region === mostCommonRegion ? "✔️" : "❌"}</Typography>
        <RowContainer>
          <Typography>{`${loadedProject.name}:`}</Typography>
          <Chip label={mostCommonRegion} color="primary" />
        </RowContainer>
        <RowContainer>
          <Typography>{`${loadedUser.name}:`}</Typography>
          <Chip label={loadedUser.region} color={loadedUser.region === mostCommonRegion ? "primary" : "secondary"} />
        </RowContainer>
      </AttributeBox>
    );
  }

  const renderIndustrySimilarity = () => {
    if (!loadedUser || !loadedProject || projectUsers.length < 1) {
      return;
    }
    const mostCommonIndustry = getMostCommonAttribute(projectUsers.map(user => user.industry));

    return (
      <AttributeBox>
        <Typography>Industry</Typography>
        <Typography>{loadedUser.industry === mostCommonIndustry ? "✔️" : "❌"}</Typography>
        <RowContainer>
          <Typography>{`${loadedProject.name}:`}</Typography>
          <Chip label={mostCommonIndustry} color="primary" />
        </RowContainer>
        <RowContainer>
          <Typography>{`${loadedUser.name}:`}</Typography>
          <Chip label={loadedUser.industry} color={loadedUser.industry === mostCommonIndustry ? "primary" : "secondary"} />
        </RowContainer>
      </AttributeBox>
    );
  }

  const renderAgeSimilarity = () => {
    if (!loadedUser || !loadedProject || projectUsers.length < 1) {
      return;
    }
    const averageAge = getAverageAttribute(projectUsers.map(user => user.age));

    return (
      <AttributeBox>
        <Typography>Age Similarity</Typography>
        <Typography>{`${(Math.min(averageAge, loadedUser.age) / Math.max(averageAge, loadedUser.age) * 100).toFixed(2)}%`}</Typography>
      </AttributeBox>
    );
  }

  const renderCompanySimilarity = () => {
    if (!loadedUser || !loadedProject || projectUsers.length < 1) {
      return;
    }

    const userCompanies: string[] = [loadedUser.currentEmployment.company];
    for (const pastEmployment of loadedUser.pastEmployment) {
      if (!userCompanies.includes(pastEmployment.company)) {
        userCompanies.push(pastEmployment.company);
      }
    }

    const commonCompanies: string[] = [];
    for (const otherUser of projectUsers) {
      if (userCompanies.includes(otherUser.currentEmployment.company) && !commonCompanies.includes(otherUser.currentEmployment.company)) {
        commonCompanies.push(otherUser.currentEmployment.company);
      }
      for (const pastEmployment of otherUser.pastEmployment) {
        if (userCompanies.includes(pastEmployment.company) && !commonCompanies.includes(pastEmployment.company)) {
          commonCompanies.push(pastEmployment.company);
        }
      }
    }
    
    return (
      <AttributeBox>
        <Typography>Common Companies</Typography>
        <RowContainer>
          {commonCompanies.map(company => {
            return (
              <Chip
                key={company}
                label={company}
                color="primary"
              />
            )
          })}
        </RowContainer>
      </AttributeBox>
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
        <TableRowContainer>
          {renderEducationSimilarity()}
          {renderRegionSimilarity()}
          {renderIndustrySimilarity()}
        </TableRowContainer>
        <TableRowContainer>
          {renderAgeSimilarity()}
          {renderCompanySimilarity()}
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
              <StyledTableCell><Chip label={attribute} color="primary" /></StyledTableCell>
              <StyledTableCell>{header1Values.includes(attribute) ? "✔️" : "❌"}</StyledTableCell>
              <StyledTableCell>{header2Values.includes(attribute) ? "✔️" : "❌"}</StyledTableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </TableContainer>
  );
}