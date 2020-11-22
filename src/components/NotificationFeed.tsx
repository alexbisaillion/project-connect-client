import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import DeleteIcon from '@material-ui/icons/Delete';
import { dismissNotification, getUsersByUsernames, NotificationItem, Operation } from "../api";
import moment from 'moment';

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
  }
}

const StyledList = styled(List)`
  background-color: #424242;
  width: 50%;
`;

const StyledAvatar = styled(Avatar)`
  & > .MuiAvatar-colorDefault {
    color: white;
  }
`;

type Props = {
  user: IUser;
}
export const NotificationFeed = ({ user }: Props) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(user.notifications);
  const [loadedUsers, setLoadedUsers] = React.useState<IUser[]>([]);

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

  return (
    <StyledList>
      {notifications.map(notification => {
        return (
          <ListItem key={notification._id}>
            <ListItemAvatar><StyledAvatar>TP</StyledAvatar></ListItemAvatar>
            <ListItemText
              primary={getNotificationMessage(
                loadedUsers.find(user => user.username === notification.sender)?.name ?? notification.sender,
                notification.project,
                notification.operation
              )}
              secondary={moment(notification.timestamp).fromNow()}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => deleteNotification(notification._id)}><DeleteIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )
      })}
    </StyledList>
  );
}