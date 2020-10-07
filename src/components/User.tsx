import React from "react";
import styled from "styled-components";
import { getProject, getUser } from "../api";
import { RouteComponentProps } from 'react-router-dom'
import { PageHeader, Attribute, PageContainer, LoadingIndicator, Panel, AttributeList, WeightedSkillList } from "./commonComponents";

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 8px;
  }
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
        <PageHeader textContent={loadedUser.name} />
        <Panel>
          <AttributeList title="Basic Information">
            <Attribute name="Current Position" value={loadedUser.currentEmployment.position + " at " + loadedUser.currentEmployment.company} />
            <Attribute name="Region" value={loadedUser.region} />
            <Attribute name="Education" value={loadedUser.education} />
            <AttributeList title="Past Employment" dense={true}>
              {loadedUser.pastEmployment.map((employment, index) => {
                return <Attribute key={index /* yikes */} value={employment.position + " at " + employment.company} />
              })}
            </AttributeList>
          </AttributeList>
        </Panel>
        <Panel>
          <AttributeList title="Skills">
            <AttributeList title="Basic Skills" dense={true}>
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
        <Panel>
          <AttributeList title="Projects">
            <AttributeList title="Current Projects" dense={true}>
              {loadedProjects.filter(project => project.isInProgress).map((project) => {
                return <Attribute key={project.name} value={project.name} />
              })}
            </AttributeList>
            <AttributeList title="Completed Projects" dense={true}>
              {loadedProjects.filter(project => !project.isInProgress).map((project) => {
                return <Attribute key={project.name} value={project.name} />
              })}
            </AttributeList>
          </AttributeList>
        </Panel>
      </UserContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
};