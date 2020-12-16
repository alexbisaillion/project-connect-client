import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, Snackbar, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { acceptRequest, dismissNotification, getUser, getUsersByUsernames, NotificationItem, Operation, registerInProject, rejectInvite, rejectRequest } from "../api";
import moment from 'moment';
import { Alert } from "@material-ui/lab";
import { PageHeader, Panel } from "./commonComponents";

const getNotificationMessage = (senderDisplayName: string, project: string, operation: Operation) => {
  switch (operation) {
    case Operation.AcceptedInvite:
      return `${senderDisplayName} has accepted your invite to join ${project}!`;
    case Operation.AcceptedRequest:
      return `${senderDisplayName} has accepted your request to join ${project}!`;
    case Operation.NewInvite:
      return `${senderDisplayName} wants you to join ${project}.`;
    case Operation.NewRequest:
      return `${senderDisplayName} wants to join ${project}.`;
    case Operation.RejectedRequest:
      return `${senderDisplayName} has rejected your request to join ${project}.`;
    case Operation.RejectedInvite:
      return `${senderDisplayName} has rejected your invite to join ${project}.`;
  }
}

const NotificationFeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const StyledList = styled(List)`
  background-color: #424242;
  width: 100%;
`;

const StyledAvatar = styled(Avatar)`
  && {
    color: white;
  }
`;

type Props = {
  user: IUser;
}
export const NotificationFeed = ({ user }: Props) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(user.notifications);
  const [loadedUsers, setLoadedUsers] = React.useState<IUser[]>([]);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState<boolean>(false);
  const [isActionSuccessful, setIsActionSuccessful] = React.useState<boolean>(false);

  const getInitial = (name: string) => {
    const names = name.toUpperCase().split(" ");
    return names[0].charAt(0) + (names[1] !== undefined ? names[1].charAt(0) : "");  
  }

  React.useEffect(() => {
    const fetchUsers = async (usernames: string[]) => {
      if (usernames.length > 0) {
        const users = await getUsersByUsernames(usernames);
        setLoadedUsers([...users.data]);  
      } else {
        setLoadedUsers([]);
      }
    }
    fetchUsers(notifications.map(notification => notification.sender));
  }, [notifications]);

  const deleteNotification = async (notificationId: string) => {
    const result = await dismissNotification(user.username, notificationId);
    setNotifications([...result.data.notifications]);
  }

  const attemptAction = async (notification: NotificationItem) => {
    try {
      if (notification.operation === Operation.NewInvite) {
        const result = await registerInProject(user.username, notification.project);
        setNotifications([...result.data.notifications]);
      } else if (notification.operation === Operation.NewRequest) {
        await acceptRequest(notification.sender, notification.project);
        const updatedUser = await getUser(user.username);
        setNotifications([...updatedUser.data.notifications]);
      }
      setIsActionSuccessful(true);
    } catch (_e) {
      setIsActionSuccessful(false);
    }
    setIsSnackbarOpen(true);
  }

  const attemptRejectAction = async (notification: NotificationItem) => {
    try {
      if (notification.operation === Operation.NewInvite) {
        const result = await rejectInvite(user.username, notification.project);
        setNotifications([...result.data.notifications]);
      } else if (notification.operation === Operation.NewRequest) {
        await rejectRequest(notification.sender, notification.project);
        const updatedUser = await getUser(user.username);
        setNotifications([...updatedUser.data.notifications]);
      }
      setIsActionSuccessful(true);
    } catch (_e) {
      setIsActionSuccessful(false);
    }
    setIsSnackbarOpen(true);
  }

  const renderSnackbar = () => {
    return (
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSnackbarOpen(false)}>
        <Alert variant="filled" onClose={() => setIsSnackbarOpen(false)} severity={isActionSuccessful ? "success" : "error"}>
          {isActionSuccessful ? "Success!" : "An error occured." }
        </Alert>
      </Snackbar>
    );
  }

  const renderNotifications = () => {
    if (notifications.length === 0) {
      return <Typography>All caught up!</Typography>;
    }
    return (
      <StyledList>
        {notifications.map(notification => {
          const fullUser = loadedUsers.find(user => user.username === notification.sender);
          return (
            <ListItem key={notification._id}>
              <ListItemAvatar><StyledAvatar>{getInitial(fullUser ? fullUser.name : notification.sender)}</StyledAvatar></ListItemAvatar>
              <ListItemText
                primary={getNotificationMessage(
                  fullUser ? fullUser.name : notification.sender,
                  notification.project,
                  notification.operation
                )}
                secondary={moment(notification.timestamp).fromNow()}
              />
              {(notification.operation === Operation.NewInvite || notification.operation === Operation.NewRequest) &&
                <IconButton onClick={() => attemptAction(notification)}><CheckIcon /></IconButton>                
              }
              {(notification.operation === Operation.NewInvite || notification.operation === Operation.NewRequest) &&
                <IconButton onClick={() => attemptRejectAction(notification)}><ClearIcon /></IconButton>                
              }
              <IconButton onClick={() => deleteNotification(notification._id)}><DeleteIcon /></IconButton>
            </ListItem>
          )
        })}
      </StyledList>
    );
  }

  return (
    <>
      {renderSnackbar()}
      <NotificationFeedContainer>
        <PageHeader size="h5" textContent="Notifications" />
        <Panel>
          {renderNotifications()}
        </Panel>
      </NotificationFeedContainer>
    </>
  )
}