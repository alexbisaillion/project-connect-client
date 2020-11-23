import React from "react";
import styled from "styled-components";
import { getProjectsByNames, getUser, registerInProject, voteForSkill } from "../api";
import { RouteComponentProps } from 'react-router-dom'
import { PageHeader, Attribute, PageContainer, LoadingIndicator, Panel, AttributeList, WeightedSkillList, UserAvatar, SearchResultsTable } from "./commonComponents";
import { PositionIcon } from "./icons";
import { Paper } from "@material-ui/core";
import { ProjectRecommendations } from "./ProjectRecommendations";
import { authenticationManager } from "../authenticationManager";

const UserContainer = styled.div`
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

const IntroContent = styled.div`
  display: flex;
  flex-direction: column;
  && > * {
    margin: 8px;
  }
`;

const IntroRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledPaper = styled(Paper)`
  && {
    padding: 16px;
    width: 70%;
  }
`;

const DetailedInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  && > * {
    width: 30%;
  }
`;

interface UserInfo { username: string; }

interface ComponentProps extends RouteComponentProps<UserInfo> {}

export const User = (props: ComponentProps) => {
  const { username } = props.match.params;
  const viewingUser = authenticationManager.getLoggedInUser();
  const [loadedUser, setLoadedUser] = React.useState<IUser | undefined>(undefined);
  const [loadedProjects, setLoadedProjects] = React.useState<IProject[]>([]);
  const [loadedInvites, setLoadedInvites] = React.useState<IProject[]>([]);
  const [loadedRequests, setLoadedRequests] = React.useState<IProject[]>([]);

  React.useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser(username);
      setLoadedUser(fetchedUser.data);
    }
    fetchUser();
  }, [username]);

  React.useEffect(() => {
    const fetchProjects = async (registeredProjects: string[], invitedProjects: string[], requestedProjects: string[], ) => {
      if (registeredProjects.length > 0) {
        const projects = await getProjectsByNames(registeredProjects);
        setLoadedProjects([...projects.data]);
      } else {
        setLoadedProjects([]);
      }

      if (invitedProjects.length > 0) {
        const projects = await getProjectsByNames(invitedProjects);
        setLoadedInvites([...projects.data]);
      } else {
        setLoadedInvites([]);
      }

      if (requestedProjects.length > 0) {
        const projects = await getProjectsByNames(requestedProjects);
        setLoadedRequests([...projects.data]);
      } else {
        setLoadedRequests([]);
      }
    }
    if (loadedUser) {
      fetchProjects(loadedUser.projects, loadedUser.invitations, loadedUser.requests);
    }
  }, [loadedUser]);

  const acceptInvitation = async (projectName: string): Promise<boolean> => {
    if (!loadedUser) {
      return false;
    }
    const result = await registerInProject(loadedUser.username, projectName);

    if (result.data) {
      setLoadedUser(result.data);
      return true;
    }
    return false;
  }

  const canVote = () => loadedUser && viewingUser.length > 0 && viewingUser !== loadedUser.username;

  const vote = async (skill: string) => {
    if (!canVote() || !loadedUser) {
      return;
    }

    const updatedUser = await voteForSkill(loadedUser.username, viewingUser, skill);
    setLoadedUser(updatedUser.data);
  }

  const getContent = () => {
    if (!loadedUser) {
      return <LoadingIndicator />
    }
    return (
      <UserContainer>
        <IntroContainer>
          <StyledPaper elevation={3}>
            <IntroContent>
              <PageHeader alignment="left" textContent={loadedUser.name} />
              <IntroRow>
                <PositionIcon />
                <PageHeader alignment="left" size="h6" textContent={loadedUser.currentEmployment.position + " at " + loadedUser.currentEmployment.company} />
              </IntroRow>
              <PageHeader alignment="left" size="subtitle1" textContent={loadedUser.bio} />
            </IntroContent>
          </StyledPaper>
          <UserAvatar name={loadedUser.name} />
        </IntroContainer>
        <DetailedInfoContainer>
          <Panel>
            <AttributeList title="Basic Information">
              <Attribute name="Current Position" value={loadedUser.currentEmployment.position + " at " + loadedUser.currentEmployment.company} />
              <Attribute name="Region" value={loadedUser.region} />
              <Attribute name="Education" value={loadedUser.education} />
            </AttributeList>
          </Panel>
          <Panel>
            <AttributeList title="Past Employment">
              {loadedUser.pastEmployment.length <= 0 &&
                <PageHeader size="subtitle1" textContent="Nothing to see here!" />
              }
              {loadedUser.pastEmployment.map((employment, index) => {
                return <Attribute key={index /* yikes */} value={employment.position + " at " + employment.company} />
              })}
            </AttributeList>
          </Panel>
          <Panel>
            <AttributeList title="Skills">
              <AttributeList title="Interests" dense={true}>
                <WeightedSkillList
                  skills={loadedUser.skills}
                  viewingUser={canVote() ? viewingUser : undefined}
                  vote={canVote() ? vote : undefined}
                />
              </AttributeList>
              <AttributeList title="Programming Languages" dense={true}>
                <WeightedSkillList
                  skills={loadedUser.programmingLanguages}
                  viewingUser={canVote() ? viewingUser : undefined}
                  vote={canVote() ? vote : undefined}  
                />
              </AttributeList>
              <AttributeList title="Frameworks" dense={true}>
                <WeightedSkillList
                  skills={loadedUser.frameworks}
                  viewingUser={canVote() ? viewingUser : undefined}
                  vote={canVote()? vote : undefined}  
                />
              </AttributeList>
            </AttributeList>
          </Panel>
        </DetailedInfoContainer>
        {loadedProjects.length > 0 &&
          <>
            <PageHeader size="h5" textContent={"Registered Projects"} />
            <SearchResultsTable projectData={loadedProjects} dataType="project" />
          </>
        }
        {authenticationManager.getLoggedInUser() === loadedUser.username && loadedInvites.length > 0 &&
          <>
            <PageHeader size="h5" textContent={"Incoming Invitations"} />
            <SearchResultsTable
              projectData={loadedInvites}
              dataType="project"
              action={{
                action: acceptInvitation,
                checkDisabled: (projectName: string) => !loadedUser.invitations.includes(projectName),
                enabledButtonLabel: "Accept",
                disabledButtonLabel: "Accepted",
                successMessage: "Invitation accepted!",
                failureMessage: "Failed to accept invitation."
              }}
            />
          </>
        }
        {authenticationManager.getLoggedInUser() === loadedUser.username && loadedRequests.length > 0 &&
          <>
            <PageHeader size="h5" textContent={"Outgoing Join Requests"} />
            <SearchResultsTable projectData={loadedRequests} dataType="project" />
          </>
        }
        {authenticationManager.getLoggedInUser() === loadedUser.username &&
          <>
            <PageHeader size="h5" textContent={"Recommended Projects"} />
            <ProjectRecommendations username={loadedUser.username} />
          </>
        }
      </UserContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
};