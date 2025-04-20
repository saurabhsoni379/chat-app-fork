import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Logo from "../assets/logo.svg";
import axios from 'axios';
import { contactRoute } from '../utils/APIRoutes';

export const Contacts = ({contacts, currentUser, chatChange}) => {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [contactStatuses, setContactStatuses] = useState({});

    useEffect(() => {
        if(currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);
            fetchContactStatuses();
        }
    }, [currentUser]);

    const fetchContactStatuses = async () => {
        if (!currentUser) return;
        
        try {
            // All contacts shown in this component are already 'accepted' by design
            // since the server filters them in the getContacts endpoint
            const contactStatusMap = {};
            contacts.forEach(contact => {
                contactStatusMap[contact._id] = 'accepted';
            });
            setContactStatuses(contactStatusMap);
        } catch (error) {
            console.error('Error fetching contact statuses', error);
        }
    };

    useEffect(() => {
        // Update statuses when contacts change
        fetchContactStatuses();
    }, [contacts]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        chatChange(contact);
    };
    
    return (
        <>
            {currentUserImage && currentUserName && (
                <Container>
                    <div className='brand'>
                        <img src={Logo} alt="logo" />
                        <h2>snappy</h2>
                    </div>
                    <div className='contacts'>
                        {contacts.length > 0 ? (
                            contacts.map((contact, index) => (
                                <div 
                                    key={index} 
                                    className={`contact ${index === currentSelected ? "selected" : ""}`}
                                    onClick={() => {changeCurrentChat(index, contact)}}
                                >
                                    <div className='avatar'>
                                        <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                                    </div>
                                    <div className='name_msg'>
                                        <div className='username'>
                                            <h3>{contact.username}</h3>
                                        </div>
                                        <StatusBadge status={contactStatuses[contact._id] || 'pending'}>
                                            {contactStatuses[contact._id] === 'accepted' ? 'Connected' : 'Pending'}
                                        </StatusBadge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <NoContactsMessage>No contacts yet</NoContactsMessage>
                        )}
                    </div>
                    <div className="current-user">
                        <div className="avatar">
                            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
                        </div>
                        <div className="username">
                            <h2>{currentUserName}</h2>
                        </div>
                    </div>
                </Container>
            )}
        </>
    );
};

const StatusBadge = styled.span`
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.7rem;
    background-color: ${props => props.status === 'accepted' ? '#4CAF50' : '#FFC107'};
    color: ${props => props.status === 'accepted' ? 'white' : 'black'};
    margin-left: 5px;
`;

const NoContactsMessage = styled.div`
    color: #ccc;
    text-align: center;
    padding: 20px;
    font-size: 0.9rem;
`;

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;   
    background-color: #080420;
    gap: 0.5rem;
    
    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        
        img {
            height: 3.5rem;
        }
        
        h2 {
            color: white;
            text-transform: uppercase;
            font-size: 2rem;
        }
    }
    
    .contacts { 
        display: flex;
        flex-direction: column;
        overflow: auto;
        gap: 0.8rem;
        
        .contact {
            display: flex;
            align-items: center;
            gap: 1rem;
            min-height: 5rem;
            background-color: #ffffff39;
            cursor: pointer;
            width: 95%;
            padding: 0.4rem;
            transition: 0.5s ease-in-out;
            
            img {
                height: 2.5rem;
                transition: 0.5s ease-in-out;
            }
            
            .name_msg {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.3rem;
                
                h3 {
                    color: white;
                    margin: 0;
                }
            }
        }
        
        .selected {
            background-color: #9186f3;
        }
        
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
            }
        } 
    }

    .current-user {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 0.5rem;
        
        img {
            height: 3.5rem;
        }
        
        h2 {
            color: white;
        }
    }
    
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        html {
            font-size: 12px;
        }
        
        .username {
            h2 {
                font-size: 1rem;
            }
        }
    }
    
    @media screen and (min-width: 360px) and (max-width: 480px) {
        html {
            font-size: 8px;
        }
    }
`;
  
