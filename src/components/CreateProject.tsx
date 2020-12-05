import React from "react";
import styled from "styled-components";
import { addProject } from "../api";
import { attributeManager } from "../attributeManager";
import { ApplyButton, AttributeDropdown, LinkButton, PageContainer, PageHeader, SkillList, TextControl } from "./commonComponents";
import { UserRecommendations } from "./UserRecommendations";

const CreateProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  && > * {
    margin: 8px;
  }
`;

enum CreateProjectState {
  Creation, RecommendUsers
}

export const CreateProject = () => {
  const [projectName, setProjectName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = React.useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = React.useState<string[]>([]);

  const [view, setView] = React.useState<CreateProjectState>(CreateProjectState.Creation);

  const onApply = async () => {
    const result = await addProject({
      name: projectName,
      skills: selectedSkills,
      programmingLanguages: selectedProgrammingLanguages,
      frameworks: selectedFrameworks,
      description: description
    });
    
    if (result.data.success) {
      setView(CreateProjectState.RecommendUsers);
    }
  }

  const renderCreation = () => {
    if (view !== CreateProjectState.Creation) {
      return;
    }

    return (
      <>
        <PageHeader textContent="Start a new project" />
        <TextControl name="Project Name" value={projectName} onChange={(newValue: string) => setProjectName(newValue)} />
        <TextControl large name="Description" value={description} onChange={(newValue: string) => setDescription(newValue)} />
        <SkillList
          skills={selectedSkills}
          onDelete={(value: string) => {
            setSelectedSkills(selectedSkills.filter(selectedSkill => selectedSkill !== value));
          }}
        />
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
          skills={selectedProgrammingLanguages}
          onDelete={(value: string) => {
            setSelectedProgrammingLanguages(selectedProgrammingLanguages.filter(selectedProgrammingLanguage => selectedProgrammingLanguage !== value));
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
          skills={selectedFrameworks}
          onDelete={(value: string) => {
            setSelectedFrameworks(selectedFrameworks.filter(selectedFramework => selectedFramework !== value));
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
        <ApplyButton name="Create Project" onApply={onApply} />
      </>
    );
  }
  
  const renderUserRecommendations = () => {
    if (view !== CreateProjectState.RecommendUsers) {
      return;
    }

    return (
      <>
        <PageHeader textContent="To get you started, here are some users that may be interested:" />
        <UserRecommendations project={projectName} />
        <LinkButton link={`/project/${projectName}`} name="Proceed to project profile"></LinkButton>
      </>
    )
  }

  const getContent = () => {
    return (
      <CreateProjectContainer>
        {renderCreation()}
        {renderUserRecommendations()}
      </CreateProjectContainer>
    )
  }

  return (
    <PageContainer>
      {getContent()}
    </PageContainer>
  )
}