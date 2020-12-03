import React from "react";
import styled from "styled-components";
import { acceptRequest, getProject, getUsersByUsernames, rejectRequest } from "../api";
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
  && > * {
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
  && > * {
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
      } else {
        setLoadedUsers([]);
      }

      if (invitees.length > 0) {
        const users = await getUsersByUsernames(invitees);
        setLoadedInvitees([...users.data]);  
      } else {
        setLoadedInvitees([])
      }

      if (requests.length > 0) {
        const users = await getUsersByUsernames(requests);
        setLoadedRequests([...users.data]);
      } else {
        setLoadedRequests([]);
      }
    }
    if (loadedProject) {
      fetchUsers(loadedProject.users, loadedProject.invitees, loadedProject.requests);
    }
  }, [loadedProject]);

  const acceptJoinRequest = async (username: string): Promise<boolean> => {
    if (!loadedProject) {
      return false;
    }
    const result = await acceptRequest(username, loadedProject.name);

    if (result.data) {
      setLoadedProject(result.data);
      return true;
    }
    return false;
  }

  const rejectJoinRequest = async (username: string): Promise<boolean> => {
    if (!loadedProject) {
      return false;
    }
    const result = await rejectRequest(username, loadedProject.name);

    if (result.data) {
      setLoadedProject(result.data);
      return true;
    }
    return false;
  }

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
              <Attribute name="Creator" value={loadedUsers.find(user => user.username === loadedProject.creator)?.name || loadedProject.creator} />
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
        {authenticationManager.getLoggedInUser() === loadedProject.creator && loadedInvitees.length > 0 &&
          <>
            <PageHeader size="h5" textContent={"Outgoing Invitations"} />
            <SearchResultsTable userData={loadedInvitees} dataType="user" />
          </>
        }
        {authenticationManager.getLoggedInUser() === loadedProject.creator && loadedRequests.length > 0 &&
          <>
            <PageHeader size="h5" textContent={"Incoming Join Requests"} />
            <SearchResultsTable
              userData={loadedRequests}
              dataType="user"
              acceptAction={{
                action: acceptJoinRequest,
                checkDisabled: (username: string) => !loadedProject.requests.includes(username),
                enabledButtonLabel: "Accept",
                disabledButtonLabel: "Accepted",
                successMessage: "Join request accepted!",
                failureMessage: "Failed to accept join request."
              }}
              rejectAction={{
                action: rejectJoinRequest,
                checkDisabled: (username: string) => !loadedProject.requests.includes(username),
                enabledButtonLabel: "Reject",
                disabledButtonLabel: "Reject",
                successMessage: "Join requested rejected.",
                failureMessage: "Failed to reject join request"
              }}
            />
          </>
        }
        {authenticationManager.getLoggedInUser() === loadedProject.creator && loadedProject.isInProgress &&
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