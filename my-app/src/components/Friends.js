import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { allUsersRoute, contactRoute, pendingContactsRoute } from '../utils/APIRoutes';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaClock, FaUserPlus, FaCheck, FaUserCheck } from 'react-icons/fa';

const Friends = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState({});
    const [contacts, setContacts] = useState([]);
    const [pendingContacts, setPendingContacts] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Current User:', currentUser);
        if (!currentUser) {
            setError('No user logged in');
            setIsLoading(false);
            return;
        }

        // Function to refresh all data
        const refreshAllData = async () => {
            setIsLoading(true);
            try {
                await fetchUsers();
                await fetchContacts();
                await fetchPendingContacts();
            } catch (error) {
                console.error('Error refreshing data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch all users
        const fetchUsers = async () => {
            try {
                console.log('Fetching users...');
                const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                console.log('Users data:', data);
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('Invalid data format received:', data);
                    setError('Invalid data format received from server');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users');
                toast.error('Error fetching users', toastOptions);
            }
        };

        // Fetch accepted contacts only
        const fetchContacts = async () => {
            try {
                console.log('Fetching contacts...');
                const { data } = await axios.get(`${contactRoute}/${currentUser._id}`);
                console.log('Contacts data:', data);
                if (Array.isArray(data)) {
                    console.log('Setting contacts to:', data);
                    setContacts(data);
                } else {
                    console.error('Invalid contacts data format:', data);
                    setContacts([]);
                }
            } catch (error) {
                console.error('Error fetching contacts:', error);
                toast.error('Error fetching contacts', toastOptions);
                setContacts([]);
            }
        };

        // Fetch pending contacts and separate them
        const fetchPendingContacts = async () => {
            try {
                console.log('Fetching pending contacts...');
                const { data } = await axios.get(`${pendingContactsRoute}/${currentUser._id}`);
                console.log('Pending contacts data:', data);
                if (Array.isArray(data)) {
                    // Separate sent requests from received requests
                    const sent = [];
                    const received = [];
                    
                    data.forEach(contact => {
                        // This check is improved to properly identify sent vs. received requests
                        // If the fromUser is the current user, it means we sent the request
                        if (contact.fromUser && contact.fromUser === currentUser._id) {
                            // Add additional logging to debug
                            console.log('Adding contact to sent requests:', contact);
                            sent.push(contact);
                        } else {
                            // Otherwise, we received the request
                            console.log('Adding contact to received requests:', contact);
                            received.push(contact);
                        }
                    });
                    
                    console.log('Sent requests:', sent);
                    console.log('Received requests:', received);
                    
                    // Update both states
                    setPendingContacts(sent);
                    setReceivedRequests(received);
                } else {
                    console.error('Invalid pending contacts data format:', data);
                    setPendingContacts([]);
                    setReceivedRequests([]);
                }
            } catch (error) {
                console.error('Error fetching pending contacts:', error);
                toast.error('Error fetching pending contacts', toastOptions);
                setPendingContacts([]);
                setReceivedRequests([]);
            }
        };

        refreshAllData();
        
        // Set up a refresh interval
        const intervalId = setInterval(refreshAllData, 30000); // Refresh every 30 seconds
        
        return () => {
            clearInterval(intervalId); // Clean up on unmount
        };
    }, [currentUser]);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleAddContact = async (contactId) => {
        setLoading(prev => ({ ...prev, [contactId]: true }));
        try {
            console.log('Adding contact:', contactId);
            const { data } = await axios.post(`${contactRoute}/add`, {
                userId: currentUser._id,
                contactId: contactId
            });
            
            if (data) {
                console.log('Contact added:', data);
                toast.success('Contact request sent successfully', toastOptions);
                
                // Get the contact user details from our users list
                const contactUser = users.find(user => user._id === contactId);
                
                // Create a properly structured pending contact object
                const pendingContact = {
                    _id: data._id,
                    contact: contactUser,
                    status: 'pending',
                    fromUser: currentUser._id  // Mark this as sent by current user
                };
                
                console.log('Adding to pending contacts:', pendingContact);
                
                // Update the pending contacts state with the new request
                setPendingContacts(prev => [...prev, pendingContact]);
                
                // No need to call fetchPendingContacts again since we've already updated the state
                // Just force a refresh of data in case we missed anything
                setTimeout(async () => {
                    try {
                        const { data } = await axios.get(`${pendingContactsRoute}/${currentUser._id}`);
                        if (Array.isArray(data)) {
                            // Separate sent requests from received requests
                            const sent = [];
                            const received = [];
                            
                            data.forEach(contact => {
                                if (contact.fromUser && contact.fromUser === currentUser._id) {
                                    sent.push(contact);
                                } else {
                                    received.push(contact);
                                }
                            });
                            
                            setPendingContacts(sent);
                            setReceivedRequests(received);
                        }
                    } catch (error) {
                        console.error('Error refreshing pending contacts:', error);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error adding contact:', error);
            toast.error(error.response?.data?.message || 'Error adding contact', toastOptions);
        } finally {
            setLoading(prev => ({ ...prev, [contactId]: false }));
        }
    };

    const handleAcceptContact = async (contactId) => {
        setLoading(prev => ({ ...prev, [contactId]: true }));
        try {
            const response = await axios.put(
                `${contactRoute}/${currentUser._id}/${contactId}`,
                { status: 'accepted' }
            );
            
            if (response.data) {
                toast.success('Contact request accepted!', toastOptions);
                
                // Refresh all data to ensure lists are updated correctly
                await refreshData();
            }
        } catch (error) {
            console.error('Error accepting contact:', error);
            toast.error('Failed to accept contact request', toastOptions);
        } finally {
            setLoading(prev => ({ ...prev, [contactId]: false }));
        }
    };

    // Add a method to reject contact requests
    const handleRejectContact = async (contactId) => {
        setLoading(prev => ({ ...prev, [contactId]: true }));
        try {
            const response = await axios.put(
                `${contactRoute}/${currentUser._id}/${contactId}`,
                { status: 'blocked' }
            );
            
            if (response.data) {
                toast.info('Contact request rejected', toastOptions);
                
                // Refresh all data to ensure lists are updated correctly
                await refreshData();
            }
        } catch (error) {
            console.error('Error rejecting contact:', error);
            toast.error('Failed to reject contact request', toastOptions);
        } finally {
            setLoading(prev => ({ ...prev, [contactId]: false }));
        }
    };

    // Function to refresh all data
    const refreshData = async () => {
        setIsLoading(true);
        try {
            // Fetch contacts first (accepted only)
            const contactsRes = await axios.get(`${contactRoute}/${currentUser._id}`);
            if (Array.isArray(contactsRes.data)) {
                setContacts(contactsRes.data);
            }
            
            // Then fetch pending requests
            const pendingRes = await axios.get(`${pendingContactsRoute}/${currentUser._id}`);
            if (Array.isArray(pendingRes.data)) {
                // Separate sent from received
                const sent = [];
                const received = [];
                
                pendingRes.data.forEach(contact => {
                    if (contact.fromUser === currentUser._id) {
                        sent.push(contact);
                    } else {
                        received.push(contact);
                    }
                });
                
                setPendingContacts(sent);
                setReceivedRequests(received);
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
            toast.error('Error refreshing contacts', toastOptions);
        } finally {
            setIsLoading(false);
        }
    };

    const getContactStatus = (userId) => {
        // Check if user is already an accepted contact
        if (contacts.some(contact => contact._id === userId)) {
            return { status: 'accepted', text: 'Connected', icon: <FaUserCheck /> };
        }
        
        // Check if there's a pending request we sent
        const pendingSent = pendingContacts.find(contact => contact.contact._id === userId);
        if (pendingSent) {
            return { status: 'pending-sent', text: 'Request Sent', icon: <FaClock /> };
        }
        
        // Check if there's a pending request we received
        const pendingReceived = receivedRequests.find(contact => contact.contact._id === userId);
        if (pendingReceived) {
            return { status: 'pending-received', text: 'Accept Request', icon: <FaUserPlus /> };
        }
        
        return { status: 'none', text: 'Add Contact', icon: <FaUserPlus /> };
    };

    const filteredUsers = () => {
        let usersList = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (activeTab === 'contacts') {
            usersList = usersList.filter(user => 
                contacts.some(contact => contact._id === user._id)
            );
        } else if (activeTab === 'sent-requests') {
            usersList = usersList.filter(user => 
                pendingContacts.some(contact => contact.contact._id === user._id)
            );
        } else if (activeTab === 'received-requests') {
            usersList = usersList.filter(user => 
                receivedRequests.some(contact => contact.contact._id === user._id)
            );
        }
        
        return usersList;
    };

    if (isLoading) {
        return (
            <Container>
                <LoadingText>Loading...</LoadingText>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <ErrorText>{error}</ErrorText>
            </Container>
        );
    }

    return (
        <Container>
            <ToastContainer />
            <Header>
                <SearchBar>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBar>
                <Tabs>
                    <Tab 
                        active={activeTab === 'all'} 
                        onClick={() => setActiveTab('all')}
                    >
                        All Users
                    </Tab>
                    <Tab 
                        active={activeTab === 'contacts'} 
                        onClick={() => setActiveTab('contacts')}
                    >
                        My Contacts
                        {contacts.length > 0 && (
                            <Badge green>{contacts.length}</Badge>
                        )}
                    </Tab>
                    <Tab 
                        active={activeTab === 'sent-requests'} 
                        onClick={() => setActiveTab('sent-requests')}
                    >
                        Sent Requests
                        {pendingContacts.length > 0 && (
                            <Badge>{pendingContacts.length}</Badge>
                        )}
                    </Tab>
                    <Tab 
                        active={activeTab === 'received-requests'} 
                        onClick={() => setActiveTab('received-requests')}
                    >
                        Received Requests
                        {receivedRequests.length > 0 && (
                            <Badge alert>{receivedRequests.length}</Badge>
                        )}
                    </Tab>
                </Tabs>
            </Header>
            <UsersList>
                {filteredUsers().length > 0 ? (
                    filteredUsers().map(user => {
                        const contactStatus = getContactStatus(user._id);
                        return (
                            <UserCard key={user._id} status={contactStatus.status}>
                                <Avatar>
                                    {user.avatarImage ? (
                                        <img src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="avatar" />
                                    ) : (
                                        <div className="default-avatar">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </Avatar>
                                <UserInfo>
                                    <h3>{user.username}</h3>
                                    <p>{user.email}</p>
                                </UserInfo>
                                {contactStatus.status === 'pending-received' ? (
                                    <ButtonGroup>
                                        <ActionButton 
                                            onClick={() => handleAcceptContact(user._id)}
                                            disabled={loading[user._id]}
                                            status="accept"
                                        >
                                            <FaCheck /> Accept
                                        </ActionButton>
                                        <ActionButton 
                                            onClick={() => handleRejectContact(user._id)}
                                            disabled={loading[user._id]}
                                            status="reject"
                                        >
                                            Reject
                                        </ActionButton>
                                    </ButtonGroup>
                                ) : (
                                    <ActionButton 
                                        onClick={() => handleAddContact(user._id)}
                                        disabled={loading[user._id] || contactStatus.status !== 'none'}
                                        status={contactStatus.status}
                                    >
                                        {loading[user._id] ? 'Processing...' : (
                                            <><span className="icon">{contactStatus.icon}</span> {contactStatus.text}</>
                                        )}
                                    </ActionButton>
                                )}
                            </UserCard>
                        )
                    })
                ) : (
                    <NoUsersText>No users found</NoUsersText>
                )}
            </UsersList>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    color: white;
    padding: 2rem;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Tabs = styled.div`
    display: flex;
    border-bottom: 1px solid #ffffff34;
    flex-wrap: wrap;
`;

const Tab = styled.div`
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    position: relative;
    font-weight: ${props => props.active ? 'bold' : 'normal'};
    color: ${props => props.active ? '#997af0' : '#ffffff'};
    border-bottom: ${props => props.active ? '2px solid #997af0' : 'none'};
    
    &:hover {
        color: #997af0;
    }
`;

const Badge = styled.span`
    position: absolute;
    top: 0;
    right: 0;
    background-color: ${props => props.green ? '#4CAF50' : props.alert ? '#ff3e3e' : '#FFC107'};
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LoadingText = styled.div`
    text-align: center;
    font-size: 1.2rem;
    color: #ffffff99;
`;

const ErrorText = styled.div`
    text-align: center;
    font-size: 1.2rem;
    color: #ff4d4d;
`;

const NoUsersText = styled.div`
    text-align: center;
    font-size: 1.2rem;
    color: #ffffff99;
`;

const SearchBar = styled.div`
    input {
        width: 100%;
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #ffffff34;
        color: white;
        border: none;
        outline: none;
        
        &::placeholder {
            color: #ffffff99;
        }
    }
`;

const UsersList = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const UserCard = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: ${props => {
        switch(props.status) {
            case 'accepted': return 'rgba(76, 175, 80, 0.2)';
            case 'pending-sent': return 'rgba(255, 193, 7, 0.2)';
            case 'pending-received': return 'rgba(33, 150, 243, 0.2)';
            default: return '#ffffff34';
        }
    }};
    border-left: 4px solid ${props => {
        switch(props.status) {
            case 'accepted': return '#4CAF50';
            case 'pending-sent': return '#FFC107';
            case 'pending-received': return '#2196F3';
            default: return 'transparent';
        }
    }};
    border-radius: 0.5rem;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
`;

const Avatar = styled.div`
    img {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        object-fit: cover;
    }
    .default-avatar {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background-color: #4e0eff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
    }
`;

const UserInfo = styled.div`
    flex: 1;
    h3 {
        margin: 0;
        font-size: 1rem;
    }
    p {
        margin: 0;
        font-size: 0.8rem;
        color: #ffffff99;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const ActionButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    cursor: ${props => props.disabled ? 'default' : 'pointer'};
    border: none;
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: ${props => {
        switch(props.status) {
            case 'accepted': return '#4CAF50';
            case 'pending-sent': return '#FFC107';
            case 'pending-received':
            case 'accept': return '#2196F3';
            default: return '#997af0';
        }
    }};
    color: white;
    
    .icon {
        display: flex;
        align-items: center;
    }
    
    &:hover {
        background-color: ${props => {
            switch(props.status) {
                case 'accepted': return '#4CAF50';
                case 'pending-sent': return '#FFC107';
                case 'pending-received':
                case 'accept': return '#1E88E5';
                default: return '#4e0eff';
            }
        }};
    }
    
    &:disabled {
        opacity: ${props => props.status !== 'none' ? 1 : 0.7};
    }
`;

export default Friends; 