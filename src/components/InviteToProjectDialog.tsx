import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";
import { getProjectsByNames, getUser, inviteToProject } from "../api";
import { SearchResultsTable } from "./commonComponents";

type InviteToProjectDialogProps = {
  open: boolean;
  onClose: () => void;
  creator: string;
  username: string;
}
export const InviteToProjectDialog = (props: InviteToProjectDialogProps) => {
  const { open, onClose, creator, username } = props;
  const [loadedUser, setLoadedUser] = React.useState<IUser>();
  const [loadedCreator, setLoadedCreator] = React.useState<IUser>();
  const [loadedProjects, setLoadedProjects] = React.useState<IProject[]>();

  React.useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser(username);
      setLoadedUser(fetchedUser.data);
    }
    fetchUser();
  }, [username]);

  React.useEffect(() => {
    const fetchCreator = async () => {
      const fetchedCreator = await getUser(creator);
      setLoadedCreator(fetchedCreator.data);
    }
    fetchCreator();
  }, [creator]);

  React.useEffect(() => {
    const fetchProjects = async (registeredProjects: string[]) => {
      if (registeredProjects.length > 0) {
        const projects = await getProjectsByNames(registeredProjects);
        setLoadedProjects([...projects.data.filter(project => project.creator === creator)]);
      } else {
        setLoadedProjects([]);
      }
    }
    if (loadedCreator) {
      fetchProjects(loadedCreator.projects);
    }
  }, [loadedCreator, creator]);

  const sendInvite = async (projectName: string): Promise<boolean> => {
    if (!loadedUser) {
      return false;
    }
    const result = await inviteToProject(loadedUser.username, projectName);

    if (result.data) {
      setLoadedUser(result.data);
      return true;
    }
    return false;
  }

  const isDisabled = (projectName: string) => {
    if (!loadedUser) {
      return true;
    }

    return loadedUser.projects.includes(projectName) || loadedUser.requests.includes(projectName) || loadedUser.invitations.includes(projectName);
  }

  return (
    <Dialog onClose={onClose} open={open} maxWidth="md">
      <DialogTitle>Invite To Project</DialogTitle>
      <DialogContent>
        <SearchResultsTable
          projectData={loadedProjects}
          dataType="project"
          acceptAction={{
            action: sendInvite,
            checkDisabled: isDisabled,
            enabledButtonLabel: "Invite",
            disabledButtonLabel: "Invite Sent",
            successMessage: "Invite sent!",
            failureMessage: "Failed to send invite."
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
