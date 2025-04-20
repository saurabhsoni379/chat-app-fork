import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Logo from "../assets/logo.svg";

const Contacts = ({contacts, currentUser, chatChange}) => {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [filteredContacts, setFilteredContacts] = useState([]);

    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);

    useEffect(() => {
        if (contacts && contacts.length > 0) {
            const acceptedContacts = contacts.filter(contact => 
                !contact.status || contact.status === 'accepted'
            );
            console.log('Filtered contacts for chat:', acceptedContacts);
            setFilteredContacts(acceptedContacts);
        } else {
            setFilteredContacts([]);
        }
    }, [contacts]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        chatChange(contact);
    };

    return (
        <Container>
            <div className="brand">
                <img src={Logo} alt="logo" />
                <h2>snappy</h2>
            </div>
            <div className="contacts">
                {filteredContacts.length > 0 && (
                    filteredContacts.map((contact, index) => {
                        return (
                            <div
                                key={index}
                                className={`contact ${index === currentSelected ? "selected" : ""}`}
                                onClick={() => changeCurrentChat(index, contact)}
                            >
                                <div className="avatar">
                                    <img
                                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                        alt="avatar"
                                    />
                                </div>
                                <div className="username">
                                    <h3>{contact.username}</h3>
                                </div>
                            </div>
                        );
                    })
                )}
                {filteredContacts.length === 0 && (
                    <NoContacts>
                        <p>No contacts yet</p>
                    </NoContacts>
                )}
            </div>
            <div className="current-user">
                <div className="avatar">
                    <img
                        src={`data:image/svg+xml;base64,${currentUserImage}`}
                        alt="avatar"
                    />
                </div>
                <div className="username">
                    <h2>{currentUserName}</h2>
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
        gap: 1rem;
        justify-content: center;
        img {
            height: 2rem;
        }
        h2 {
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
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #ffffff34;
            min-height: 5rem;
            cursor: pointer;
            width: 90%;
            border-radius: 0.2rem;
            padding: 0.4rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            transition: 0.5s ease-in-out;
            .avatar {
                img {
                    height: 3rem;
                }
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
        .selected {
            background-color: #9a86f3;
        }
    }
    .current-user {
        background-color: #0d0d30;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        .avatar {
            img {
                height: 4rem;
                max-inline-size: 100%;
            }
        }
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

const NoContacts = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #ffffff8a;
    width: 100%;
    text-align: center;
`;

export default Contacts; 