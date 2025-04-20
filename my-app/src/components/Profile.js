import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEdit, FaEnvelope, FaUser, FaCalendarAlt, FaBell, FaCog, FaShieldAlt } from 'react-icons/fa';

const Profile = ({ user }) => {
    const [activeTab, setActiveTab] = useState('info');
    
    // Mocked data - in real app would come from props or API
    const joinDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    return (
        <Container>
            <ProfileWrapper>
                <ProfileHeader>
                    <AvatarSection>
                        <AvatarContainer>
                            <Avatar src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="avatar" />
                            <AvatarEditButton>
                                <FaEdit />
                            </AvatarEditButton>
                        </AvatarContainer>
                        <OnlineStatus />
                    </AvatarSection>
                    <UserNameSection>
                        <UserName>{user.username}</UserName>
                        <UserEmail>{user.email}</UserEmail>
                        <UserBadges>
                            <Badge>Premium</Badge>
                            <Badge secondary>Verified</Badge>
                        </UserBadges>
                    </UserNameSection>
                </ProfileHeader>

                <TabMenu>
                    <TabItem 
                        active={activeTab === 'info'} 
                        onClick={() => setActiveTab('info')}
                    >
                        <FaUser /> <span>Information</span>
                    </TabItem>
                    <TabItem 
                        active={activeTab === 'settings'} 
                        onClick={() => setActiveTab('settings')}
                    >
                        <FaCog /> <span>Settings</span>
                    </TabItem>
                    <TabItem 
                        active={activeTab === 'notifications'} 
                        onClick={() => setActiveTab('notifications')}
                    >
                        <FaBell /> <span>Notifications</span>
                    </TabItem>
                    <TabItem 
                        active={activeTab === 'privacy'} 
                        onClick={() => setActiveTab('privacy')}
                    >
                        <FaShieldAlt /> <span>Privacy</span>
                    </TabItem>
                </TabMenu>

                <TabContent show={activeTab === 'info'}>
                    <InfoSection>
                        <InfoRow>
                            <InfoLabel><FaUser /> Username</InfoLabel>
                            <InfoValue>{user.username}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel><FaEnvelope /> Email</InfoLabel>
                            <InfoValue>{user.email}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel><FaCalendarAlt /> Member Since</InfoLabel>
                            <InfoValue>{joinDate}</InfoValue>
                        </InfoRow>
                    </InfoSection>
                    
                    <StatsCards>
                        <StatCard>
                            <StatNumber>12</StatNumber>
                            <StatLabel>Chats</StatLabel>
                        </StatCard>
                        <StatCard>
                            <StatNumber>34</StatNumber>
                            <StatLabel>Friends</StatLabel>
                        </StatCard>
                        <StatCard>
                            <StatNumber>580</StatNumber>
                            <StatLabel>Messages</StatLabel>
                        </StatCard>
                    </StatsCards>
                </TabContent>
                
                <TabContent show={activeTab === 'settings'}>
                    <SettingsPlaceholder>
                        <h3>Settings</h3>
                        <p>Account settings and preferences would go here</p>
                    </SettingsPlaceholder>
                </TabContent>
                
                <TabContent show={activeTab === 'notifications'}>
                    <SettingsPlaceholder>
                        <h3>Notifications</h3>
                        <p>Notification preferences would go here</p>
                    </SettingsPlaceholder>
                </TabContent>
                
                <TabContent show={activeTab === 'privacy'}>
                    <SettingsPlaceholder>
                        <h3>Privacy & Security</h3>
                        <p>Privacy and security settings would go here</p>
                    </SettingsPlaceholder>
                </TabContent>
                
                <ButtonGroup>
                    <Button primary>Edit Profile</Button>
                    <Button>Change Password</Button>
                </ButtonGroup>
            </ProfileWrapper>
        </Container>
    );
};

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #131324;
    padding: 2rem;
`;

const ProfileWrapper = styled.div`
    background: linear-gradient(135deg, #1a1a3a 0%, #0d0d2b 100%);
    border-radius: 1.5rem;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    animation: ${slideIn} 0.5s ease-out;
`;

const ProfileHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 2rem;
    background: linear-gradient(135deg, #4e0eff 0%, #7a43ff 100%);
    
    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

const AvatarSection = styled.div`
    position: relative;
    margin-right: 2rem;
    
    @media (max-width: 768px) {
        margin-right: 0;
        margin-bottom: 1.5rem;
    }
`;

const AvatarContainer = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
        transform: scale(1.05);
    }
`;

const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const AvatarEditButton = styled.button`
    position: absolute;
    right: 0;
    bottom: 0;
    width: 30px;
    height: 30px;
    background-color: #4e0eff;
    border: none;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #7a43ff;
        transform: rotate(15deg);
    }
`;

const OnlineStatus = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-color: #4CAF50;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const UserNameSection = styled.div`
    color: white;
`;

const UserName = styled.h2`
    font-size: 1.8rem;
    margin: 0;
    font-weight: 700;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const UserEmail = styled.p`
    margin: 0.2rem 0 1rem;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
`;

const UserBadges = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const Badge = styled.span`
    background-color: ${props => props.secondary ? '#ff7675' : '#74b9ff'};
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 0.2rem 0.6rem;
    border-radius: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const TabMenu = styled.div`
    display: flex;
    background-color: #1a1a3a;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
        display: none;
    }
    
    @media (max-width: 600px) {
        justify-content: flex-start;
    }
`;

const TabItem = styled.button`
    background: none;
    border: none;
    padding: 1rem 1.5rem;
    color: ${props => props.active ? '#4e0eff' : 'rgba(255, 255, 255, 0.6)'};
    font-weight: ${props => props.active ? 'bold' : 'normal'};
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: ${props => props.active ? '2px solid #4e0eff' : 'none'};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    
    &:hover {
        color: ${props => props.active ? '#4e0eff' : 'rgba(255, 255, 255, 0.9)'};
    }
    
    @media (max-width: 600px) {
        padding: 1rem 0.8rem;
        font-size: 0.9rem;
        
        span {
            display: none;
        }
    }
`;

const TabContent = styled.div`
    padding: 2rem;
    background-color: #0d0d2b;
    min-height: 300px;
    display: ${props => props.show ? 'block' : 'none'};
    animation: ${slideIn} 0.3s ease-out;
`;

const InfoSection = styled.div`
    background-color: #1a1a3a;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
        border-bottom: none;
    }
    
    @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
`;

const InfoLabel = styled.div`
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const InfoValue = styled.div`
    color: white;
    font-weight: 500;
`;

const StatsCards = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const StatCard = styled.div`
    background-color: #1a1a3a;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
`;

const StatNumber = styled.div`
    font-size: 2rem;
    font-weight: bold;
    color: #4e0eff;
    margin-bottom: 0.5rem;
    animation: ${pulseAnimation} 2s infinite ease-in-out;
`;

const StatLabel = styled.div`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
`;

const SettingsPlaceholder = styled.div`
    background-color: #1a1a3a;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    color: white;
    
    h3 {
        margin-top: 0;
        color: #4e0eff;
    }
    
    p {
        color: rgba(255, 255, 255, 0.7);
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    background-color: #0d0d2b;
    
    @media (max-width: 500px) {
        flex-direction: column;
    }
`;

const Button = styled.button`
    padding: 0.8rem 1.5rem;
    background-color: ${props => props.primary ? '#4e0eff' : 'transparent'};
    color: white;
    border: ${props => props.primary ? 'none' : '1px solid #4e0eff'};
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: ${props => props.primary ? '#7a43ff' : 'rgba(78, 14, 255, 0.1)'};
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(1px);
    }
`;

export default Profile; 