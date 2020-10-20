import React from "react";
import styled from "styled-components";
import { getProject, getUser } from "../api";
import { RouteComponentProps } from 'react-router-dom'
import { PageHeader, Attribute, PageContainer, LoadingIndicator, Panel, AttributeList, WeightedSkillList, UserAvatar, SearchResultsTable } from "./commonComponents";
import { PositionIcon } from "./icons";
import { Paper } from "@material-ui/core";

const UserContainer = styled.div`
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

const IntroContent = styled.div`
  display: flex;
  flex-direction: column;
  > * {
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
  justify-content: space-around;
  width: 100%;
`;

interface UserInfo { username: string; }

interface ComponentProps extends RouteComponentProps<UserInfo> {}

export const User = (props: ComponentProps) => {
  const { username } = props.match.params;
  const [loadedUser, setLoadedUser] = React.useState<IUser | undefined>(undefined);
  const [loadedProjects, setLoadedProjects] = React.useState<IProject[]>([]);

  React.useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser(username);
      setLoadedUser(fetchedUser.data);
    }
    fetchUser();
  }, [username]);

  React.useEffect(() => {
    const fetchProjects = async (names: string[]) => {
      const projects: IProject[] = [];
      for (const name of names) {
        const fetchedProject = await getProject(name);
        projects.push(fetchedProject.data);
      }
      setLoadedProjects([...projects]);
    }
    if (loadedUser && loadedUser.projects) {
      fetchProjects(loadedUser.projects);
    }
  }, [loadedUser]);

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
                <WeightedSkillList skills={loadedUser.skills} />
              </AttributeList>
              <AttributeList title="Programming Languages" dense={true}>
                <WeightedSkillList skills={loadedUser.programmingLanguages} />
              </AttributeList>
              <AttributeList title="Frameworks" dense={true}>
                <WeightedSkillList skills={loadedUser.frameworks} />
              </AttributeList>
            </AttributeList>
          </Panel>
        </DetailedInfoContainer>
        <SearchResultsTable projectData={loadedProjects} dataType="project" />
      </UserContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
};