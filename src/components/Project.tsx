import React from "react";
import styled from "styled-components";
import { getProject, getUsersByUsernames } from "../api";
import { RouteComponentProps } from 'react-router-dom'
import { PageHeader, Attribute, PageContainer, LoadingIndicator, Panel, AttributeList, SkillList, SearchResultsTable } from "./commonComponents";
import { getDisplayDate } from "../utilities";
import { Paper } from "@material-ui/core";
import { UserRecommendations } from "./UserRecommendations";
import { authenticationManager } from "../authenticationManager";

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 8px;
  }
`;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 24px;
`;

const StyledPaper = styled(Paper)`
  && {
    padding: 16px;
    width: 100%;
  }
`;

const IntroContent = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    margin: 8px;
  }
`;

const DetailedInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

interface ProjectInfo { name: string; }

interface ComponentProps extends RouteComponentProps<ProjectInfo> {}

export const Project = (props: ComponentProps) => {
  const { name } = props.match.params;
  const [loadedProject, setLoadedProject] = React.useState<IProject | undefined>(undefined);
  const [loadedUsers, setLoadedUsers] = React.useState<IUser[]>([]);
  const [loadedInvitees, setLoadedInvitees] = React.useState<IUser[]>([]);
  const [loadedRequests, setLoadedRequests] = React.useState<IUser[]>([]);

  React.useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getProject(name);
      setLoadedProject(fetchedProject.data);
    }
    fetchProject();
  }, [name]);

  React.useEffect(() => {
    const fetchUsers = async (usernames: string[], invitees: string[], requests: string[]) => {
      if (usernames.length > 0) {
        const users = await getUsersByUsernames(usernames);
        setLoadedUsers([...users.data]);  
      }

      if (invitees.length > 0) {
        const users = await getUsersByUsernames(invitees);
        setLoadedInvitees([...users.data]);  
      }

      if (requests.length > 0) {
        const users = await getUsersByUsernames(requests);
        setLoadedRequests([...users.data]);
      }
    }
    if (loadedProject) {
      fetchUsers(loadedProject.users, loadedProject.invitees, loadedProject.requests);
    }
  }, [loadedProject]);

  const getContent = () => {
    if (!loadedProject) {
      return <LoadingIndicator />
    }
    return (
      <ProjectContainer>
        <IntroContainer>
          <StyledPaper elevation={3}>
            <IntroContent>
              <PageHeader textContent={loadedProject.name} />
              <PageHeader alignment="left" size="subtitle1" textContent={loadedProject.description} />
            </IntroContent>
          </StyledPaper>
        </IntroContainer>
        <DetailedInfoContainer>
          <Panel>
            <AttributeList title="Basic Information">
              <Attribute name="Start Date" value={getDisplayDate(loadedProject.startDate)} />
              {loadedProject.completionDate && 
                <Attribute name="Completion Date" value={getDisplayDate(loadedProject.completionDate)} />
              }
            </AttributeList>
          </Panel>
          <Panel>
            <AttributeList title="Skills">
              <AttributeList title="Basic" dense={true}>
                <SkillList skills={loadedProject.skills} />
              </AttributeList>
              <AttributeList title="Programming Languages" dense={true}>
                <SkillList skills={loadedProject.programmingLanguages} />
              </AttributeList>
              <AttributeList title="Frameworks" dense={true}>
                <SkillList skills={loadedProject.frameworks} />
              </AttributeList>
            </AttributeList>
          </Panel>
        </DetailedInfoContainer>
        {loadedUsers.length > 0 &&
          <>
            <PageHeader size="h5" textContent={"Members"} />
            <SearchResultsTable userData={loadedUsers} dataType="user" />
          </>
        }
        {loadedInvitees.length > 0 &&
          <>
            <PageHeader size="h5" textContent={"Invitees"} />
            <SearchResultsTable userData={loadedInvitees} dataType="user" />
          </>
        }
        {loadedRequests.length > 0 &&
          <>
            <PageHeader size="h5" textContent={"Requests To Join"} />
            <SearchResultsTable userData={loadedRequests} dataType="user" />
          </>
        }
        {authenticationManager.getLoggedInUser() === loadedProject.creator &&
          <>
            <PageHeader size="h5" textContent={"Recommended Users"} />
            <UserRecommendations project={loadedProject.name} />
          </>
        }
      </ProjectContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
};