import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { notificationsRoute, contactRoute, host } from '../utils/APIRoutes';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

function Notifications({ currentUser, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef(null);
  const socket = useRef();

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [currentUser]);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        onClose();
      }
    }

    // Only add the event listener if the notification is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser && isOpen) {
        try {
          setLoading(true);
          const response = await axios.get(`${notificationsRoute}/${currentUser._id}`);
          // Ensure notifications is always an array
          if (Array.isArray(response.data)) {
            setNotifications(response.data);
          } else {
            console.error('Expected array but got:', response.data);
            setNotifications([]);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [currentUser, isOpen]);

  const handleAccept = async (notification) => {
    try {
      console.log('Accepting contact request:', notification);
      
      // Update contact status
      const response = await axios.put(
        `${contactRoute}/${currentUser._id}/${notification.fromUser._id}`,
        { 
          status: 'accepted',
          notificationId: notification._id 
        }
      );
      
      console.log('Contact accepted response:', response.data);

      // Emit socket event to notify the other user
      if (socket.current) {
        socket.current.emit('contact-status-change', {
          senderId: currentUser._id,
          recipientId: notification.fromUser._id,
          status: 'accepted'
        });
      }

      // Update notification in the UI
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n._id === notification._id 
            ? { ...n, status: 'accepted' } 
            : n
        )
      );

      toast.success(`You are now connected with ${notification.fromUser.username}`);
    } catch (error) {
      console.error('Error accepting contact request:', error);
      toast.error('Failed to accept contact request');
    }
  };

  const handleReject = async (notification) => {
    try {
      // Update contact status
      await axios.put(
        `${contactRoute}/${currentUser._id}/${notification.fromUser._id}`,
        { 
          status: 'blocked',
          notificationId: notification._id 
        }
      );

      // Update notification in the UI
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n._id === notification._id 
            ? { ...n, status: 'rejected' } 
            : n
        )
      );

      toast.info(`Request from ${notification.fromUser.username} rejected`);
    } catch (error) {
      console.error('Error rejecting contact request:', error);
      toast.error('Failed to reject contact request');
    }
  };

  const handleDismiss = async (notificationId) => {
    try {
      await axios.delete(`${notificationsRoute}/${notificationId}`);
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n._id !== notificationId)
      );
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error('Failed to dismiss notification');
    }
  };

  if (!isOpen) return null;

  return (
    <NotificationContainer ref={notificationRef}>
      <Header>
        <h2>Notifications</h2>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </Header>
      
      {loading ? (
        <LoadingMessage>Loading notifications...</LoadingMessage>
      ) : notifications.length === 0 ? (
        <NoNotifications>No notifications</NoNotifications>
      ) : (
        <NotificationList>
          {notifications.map(notification => (
            <NotificationItem key={notification._id} status={notification.status}>
              <NotificationContent>
                <Avatar src={`data:image/svg+xml;base64,${notification.fromUser.avatarImage}`} alt="avatar" />
                <div>
                  <Username>{notification.fromUser.username}</Username>
                  <Message>
                    {notification.type === 'contactRequest' && 'sent you a contact request'}
                  </Message>
                  <Time>{new Date(notification.createdAt).toLocaleString()}</Time>
                </div>
              </NotificationContent>
              
              <Actions>
                {notification.status === 'pending' ? (
                  <>
                    <AcceptButton onClick={() => handleAccept(notification)}>
                      Accept
                    </AcceptButton>
                    <RejectButton onClick={() => handleReject(notification)}>
                      Reject
                    </RejectButton>
                  </>
                ) : (
                  <StatusLabel status={notification.status}>
                    {notification.status === 'accepted' ? 'Accepted' : 'Rejected'}
                  </StatusLabel>
                )}
                <DismissButton onClick={() => handleDismiss(notification._id)}>
                  Dismiss
                </DismissButton>
              </Actions>
            </NotificationItem>
          ))}
        </NotificationList>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </NotificationContainer>
  );
}

const NotificationContainer = styled.div`
  position: absolute;
  right: 0;
  top: 60px;
  width: 350px;
  max-height: 500px;
  background-color: #131324;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #2a2a3c;
  background-color: #0a0a1b;
  
  h2 {
    margin: 0;
    color: white;
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #997af0;
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: #4e0eff;
  }
`;

const NotificationList = styled.div`
  overflow-y: auto;
  max-height: 400px;
`;

const NotificationItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #2a2a3c;
  opacity: ${props => props.status !== 'pending' ? 0.7 : 1};
  background-color: ${props => props.status === 'accepted' ? 'rgba(0, 128, 0, 0.1)' : 
    props.status === 'rejected' ? 'rgba(255, 0, 0, 0.1)' : 'transparent'};
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #4e0eff;
`;

const Username = styled.div`
  color: white;
  font-weight: bold;
`;

const Message = styled.div`
  color: #ccc;
  font-size: 14px;
`;

const Time = styled.div`
  color: #888;
  font-size: 12px;
  margin-top: 5px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  font-weight: bold;
`;

const AcceptButton = styled(ActionButton)`
  background-color: #997af0;
  color: white;
  
  &:hover {
    background-color: #4e0eff;
  }
`;

const RejectButton = styled(ActionButton)`
  background-color: #ff5555;
  color: white;
  
  &:hover {
    background-color: #ff0000;
  }
`;

const DismissButton = styled(ActionButton)`
  background-color: transparent;
  color: #888;
  border: 1px solid #444;
  
  &:hover {
    background-color: #222;
    color: white;
  }
`;

const StatusLabel = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${props => props.status === 'accepted' ? '#4CAF50' : '#FF5555'};
`;

const LoadingMessage = styled.div`
  color: #ccc;
  text-align: center;
  padding: 20px;
`;

const NoNotifications = styled.div`
  color: #ccc;
  text-align: center;
  padding: 30px;
`;

export default Notifications; 