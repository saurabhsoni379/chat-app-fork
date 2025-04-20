import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FaUser, FaUserFriends, FaComments, FaSignOutAlt, FaBell } from 'react-icons/fa';
import axios from 'axios';
import { notificationsRoute } from '../utils/APIRoutes';
import Notifications from './Notifications';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState(() => {
        const path = location.pathname;
        if (path.includes('/profile')) return 'profile';
        if (path.includes('/friends')) return 'friends';
        if (path.includes('/chat')) return 'chat';
        return 'chat';
    });
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('chat-app-user'));
        setCurrentUser(user);

        if (user) {
            // Fetch notification count
            fetchNotificationCount(user._id);
            
            // Set up interval to check for new notifications
            const interval = setInterval(() => {
                fetchNotificationCount(user._id);
            }, 30000); // Check every 30 seconds
            
            return () => clearInterval(interval);
        }
    }, []);
    
    const fetchNotificationCount = async (userId) => {
        try {
            const response = await axios.get(`${notificationsRoute}/${userId}`);
            // Ensure we're working with an array
            if (Array.isArray(response.data)) {
                const pendingNotifications = response.data.filter(n => n.status === 'pending');
                setNotificationCount(pendingNotifications.length);
            } else {
                console.error('Expected array but got:', response.data);
                setNotificationCount(0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotificationCount(0);
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        navigate(`/${section}`);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        // Reset notification count when opening notifications
        if (!isNotificationsOpen && currentUser) {
            fetchNotificationCount(currentUser._id);
        }
    };

    return (
        <Container>
            <MenuBar>
                <MenuItems>
                    <MenuIcon 
                        active={activeSection === 'profile'} 
                        onClick={() => handleSectionChange('profile')}
                        title="Profile"
                    >
                        <FaUser />
                    </MenuIcon>
                    <MenuIcon 
                        active={activeSection === 'friends'} 
                        onClick={() => handleSectionChange('friends')}
                        title="Friends"
                    >
                        <FaUserFriends />
                    </MenuIcon>
                    <MenuIcon 
                        active={activeSection === 'chat'} 
                        onClick={() => handleSectionChange('chat')}
                        title="Chat"
                    >
                        <FaComments />
                    </MenuIcon>
                    <NotificationIconWrapper onClick={toggleNotifications} title="Notifications">
                        <MenuIcon active={isNotificationsOpen}>
                            <FaBell />
                        </MenuIcon>
                        {notificationCount > 0 && (
                            <NotificationBadge>{notificationCount}</NotificationBadge>
                        )}
                    </NotificationIconWrapper>
                </MenuItems>
                <LogoutButton onClick={handleLogout} title="Logout">
                    <FaSignOutAlt />
                </LogoutButton>
            </MenuBar>
            <ContentArea>
                <Outlet />
                {currentUser && (
                    <Notifications 
                        currentUser={currentUser} 
                        isOpen={isNotificationsOpen} 
                        onClose={() => setIsNotificationsOpen(false)} 
                    />
                )}
            </ContentArea>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    background-color: #131324;
`;

const MenuBar = styled.div`
    width: 80px;
    background-color: #00000076;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem 0;
`;

const MenuItems = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

const MenuIcon = styled.div`
    color: ${props => props.active ? '#4e0eff' : '#ffffff'};
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: 0.3s ease-in-out;
`;

const NotificationIconWrapper = styled.div`
    position: relative;
    cursor: pointer;
`;

const NotificationBadge = styled.div`
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ff3e3e;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
`;

const LogoutButton = styled(MenuIcon)`
    color: #4e0eff;
`;

const ContentArea = styled.div`
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    position: relative;
`;

export default Layout; 