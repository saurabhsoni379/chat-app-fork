import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import Contact from '../models/contact';

const Contacts = ({ contacts, currentUser, chatChange }) => {
    return (
        <Container>
            <div className="brand">
                <h3>Chat App</h3>
            </div>
            <div className="contacts">
                {contacts.map((contact) => (
                    <div
                        className="contact"
                        key={contact._id}
                        onClick={() => {
                            console.log('Contact clicked:', contact);
                            chatChange(contact);
                        }}
                    >
                        <div className="avatar">
                            {contact.avatarImage ? (
                                <Avatar
                                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                    alt={contact.username}
                                    sx={{ width: 48, height: 48 }}
                                />
                            ) : (
                                <Avatar
                                    alt={contact.username}
                                    sx={{ width: 48, height: 48, bgcolor: '#4e0eff' }}
                                >
                                    {contact.username[0].toUpperCase()}
                                </Avatar>
                            )}
                        </div>
                        <div className="username">
                            <h3>{contact.username}</h3>
                        </div>
                    </div>
                ))}
            </div>
            <div className="current-user">
                <div className="avatar">
                    {currentUser.avatarImage ? (
                        <Avatar
                            src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                            alt={currentUser.username}
                            sx={{ width: 48, height: 48 }}
                        />
                    ) : (
                        <Avatar
                            alt={currentUser.username}
                            sx={{ width: 48, height: 48, bgcolor: '#4e0eff' }}
                        >
                            {currentUser.username[0].toUpperCase()}
                        </Avatar>
                    )}
                </div>
                <div className="username">
                    <h2>{currentUser.username}</h2>
                </div>
            </div>
        </Container>
    );
};

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;
    background-color: #080420;

    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        h3 {
            color: white;
            text-transform: uppercase;
        }
    }

    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 0.2rem;
            }
        }
        .contact {
            background-color: #ffffff39;
            min-height: 5rem;
            width: 90%;
            cursor: pointer;
            border-radius: 0.2rem;
            padding: 0.4rem;
            gap: 1rem;
            align-items: center;
            display: flex;
            transition: 0.5s ease-in-out;
            &:hover {
                background-color: #9186f3;
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
        .selected {
            background-color: #9186f3;
        }
    }

    .current-user {
        background-color: #0d0d30;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        .username {
            h2 {
                color: white;
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            gap: 0.5rem;
            .username {
                h2 {
                    font-size: 1rem;
                }
            }
        }
    }
`;

export default Contacts; 