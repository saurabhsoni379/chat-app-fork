import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import { Send } from '@mui/icons-material';

const Chatcontainer = ({ currentChat, currentUser, socket, messages, sendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim().length > 0) {
            await sendMessage(newMessage);
            setNewMessage('');
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        {currentChat.avatarImage ? (
                            <Avatar
                                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                alt={currentChat.username}
                                sx={{ width: 48, height: 48 }}
                            />
                        ) : (
                            <Avatar
                                alt={currentChat.username}
                                sx={{ width: 48, height: 48, bgcolor: '#4e0eff' }}
                            >
                                {currentChat.username[0].toUpperCase()}
                            </Avatar>
                        )}
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
            </div>
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div
                        ref={scrollRef}
                        key={index}
                        className={`message ${
                            message.from === currentUser._id ? 'sended' : 'received'
                        }`}
                    >
                        <div className="content">
                            <p>{message.message}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <form onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit">
                        <Send />
                    </button>
                </form>
            </div>
        </Container>
    );
};

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 80% 10%;
    gap: 0.1rem;
    overflow: hidden;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-template-rows: 15% 70% 15%;
    }
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            .username {
                h3 {
                    color: white;
                }
            }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .message {
            display: flex;
            align-items: center;
            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #d1d1d1;
                @media screen and (min-width: 720px) and (max-width: 1080px) {
                    max-width: 70%;
                }
            }
        }
        .sended {
            justify-content: flex-end;
            .content {
                background-color: #4f04ff21;
            }
        }
        .received {
            justify-content: flex-start;
            .content {
                background-color: #9900ff20;
            }
        }
    }
    .chat-input {
        display: grid;
        align-items: center;
        grid-template-columns: 5% 95%;
        background-color: #080420;
        padding: 0 2rem;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            padding: 0 1rem;
            gap: 1rem;
        }
        form {
            display: flex;
            align-items: center;
            gap: 2rem;
            width: 100%;
            input {
                width: 90%;
                height: 60%;
                background-color: transparent;
                color: white;
                border: none;
                padding-left: 1rem;
                font-size: 1.2rem;
                &::selection {
                    background-color: #9186f3;
                }
                &:focus {
                    outline: none;
                }
            }
            button {
                padding: 0.3rem 2rem;
                border-radius: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #9186f3;
                border: none;
                @media screen and (min-width: 720px) and (max-width: 1080px) {
                    padding: 0.3rem 1rem;
                    svg {
                        font-size: 1rem;
                    }
                }
                svg {
                    font-size: 2rem;
                    color: white;
                }
            }
        }
    }
`;

export default Chatcontainer; 