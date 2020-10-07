import React from "react";
import styled from "styled-components";
import { getProject } from "../api";
import { RouteComponentProps } from 'react-router-dom'
import { PageHeader, Attribute, PageContainer, LoadingIndicator, Panel, AttributeList, SkillList } from "./commonComponents";
import { getDisplayDate } from "../utilities";

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 8px;
  }
`;

interface ProjectInfo { name: string; }

interface ComponentProps extends RouteComponentProps<ProjectInfo> {}

export const Project = (props: ComponentProps) => {
  const { name } = props.match.params;
  const [loadedProject, setLoadedProject] = React.useState<IProject | undefined>(undefined);

  React.useEffect(() => {
    const fetchProject = async () => {
      const fetchedProject = await getProject(name);
      setLoadedProject(fetchedProject.data);
    }
    fetchProject();
  }, [name]);

  const getContent = () => {
    if (!loadedProject) {
      return <LoadingIndicator />
    }
    return (
      <ProjectContainer>
        <PageHeader textContent={loadedProject.name} />
        <Panel>
          <AttributeList title="Basic Information">
            <Attribute name="Start Date" value={getDisplayDate(loadedProject.startDate)} />
            {loadedProject.completionDate && 
              <Attribute name="Completion Date" value={getDisplayDate(loadedProject.completionDate)} />
            }
          </AttributeList>
        </Panel>
        <Panel>
          <AttributeList title="People">
            <AttributeList title="Joined" dense={true}>
              {loadedProject.users.map((user) => {
                return <Attribute key={user} value={user} avatar />
              })}
            </AttributeList>
            <AttributeList title="Invited" dense={true}>
              {loadedProject.invitees.map((user) => {
                return <Attribute key={user} value={user} avatar />
              })}
            </AttributeList>
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
      </ProjectContainer>
    );
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  );
};