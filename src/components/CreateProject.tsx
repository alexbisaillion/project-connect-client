import React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { addProject } from "../api";
import { attributeManager } from "../attributeManager";
import { ApplyButton, AttributeDropdown, PageContainer, PageHeader, SkillList, TextControl } from "./commonComponents";

const CreateProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > * {
    margin: 8px;
  }
`;

export const CreateProject = () => {
  const [projectName, setProjectName] = React.useState<string>("");
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = React.useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = React.useState<string[]>([]);
  const [isCreated, setIsCreated] = React.useState<boolean>(false);

  const onApply = async () => {
    const result = await addProject({
      name: projectName,
      skills: selectedSkills,
      programmingLanguages: selectedProgrammingLanguages,
      frameworks: selectedFrameworks
    });
    
    if (result.data.success) {
      setIsCreated(true);
    }
  }

  const getContent = () => {
    if (isCreated) {
      return <Redirect to={`/project/${projectName}`} />
    } else {
      return (
        <CreateProjectContainer>
          <PageHeader textContent="Start a new project" />
          <TextControl name="Project Name" value={projectName} onChange={(newValue: string) => setProjectName(newValue)} />
          <AttributeDropdown
            name="Basic Skills"
            options={attributeManager.getSkills()}
            onChange={(newValue: string) => {
              if (!selectedSkills.includes(newValue)) {
                setSelectedSkills([...selectedSkills, newValue]);
              }
            }}
          />          
          <SkillList
            skills={selectedSkills}
            onDelete={(value: string) => {
              setSelectedSkills(selectedSkills.filter(selectedSkill => selectedSkill !== value));
            }}
          />
          <AttributeDropdown
            name="Programming Languages"
            options={attributeManager.getProgrammingLanguages()}
            onChange={(newValue: string) => {
              if (!selectedProgrammingLanguages.includes(newValue)) {
                setSelectedProgrammingLanguages([...selectedProgrammingLanguages, newValue]);
              }
            }}
          />          
          <SkillList
            skills={selectedProgrammingLanguages}
            onDelete={(value: string) => {
              setSelectedProgrammingLanguages(selectedProgrammingLanguages.filter(selectedProgrammingLanguage => selectedProgrammingLanguage !== value));
            }}
          />
          <AttributeDropdown
            name="Frameworks"
            options={attributeManager.getFrameworks()}
            onChange={(newValue: string) => {
              if (!selectedFrameworks.includes(newValue)) {
                setSelectedFrameworks([...selectedFrameworks, newValue]);
              }
            }}
          />          
          <SkillList
            skills={selectedFrameworks}
            onDelete={(value: string) => {
              setSelectedFrameworks(selectedFrameworks.filter(selectedFramework => selectedFramework !== value));
            }}
          />
          <ApplyButton name="Create Project" onApply={onApply} />
        </CreateProjectContainer>
      )
    }
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  )
}