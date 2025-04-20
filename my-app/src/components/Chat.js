import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { contactRoute, getAllMessageRoute, sendMessageRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import Chatcontainer from '../components/Chatcontainer';
import Logout from '../components/Logout';
import { io } from 'socket.io-client';

const Chat = ({ currentUser }) => {
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const socket = React.useRef();

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const { data } = await axios.get(`${contactRoute}/${currentUser._id}`);
                setContacts(data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        fetchContacts();
    }, [currentUser]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (currentChat) {
                try {
                    const { data } = await axios.get(`${getAllMessageRoute}/${currentUser._id}/${currentChat._id}`);
                    setMessages(data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };
        fetchMessages();
    }, [currentChat, currentUser]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-receive", (msg) => {
                if (currentChat && msg.from === currentChat._id) {
                    setMessages((prev) => [...prev, msg]);
                }
            });
        }
    }, [currentChat]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    const handleSendMessage = async (msg) => {
        if (currentChat) {
            try {
                const { data } = await axios.post(sendMessageRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                    message: msg
                });
                socket.current.emit("send-msg", {
                    to: currentChat._id,
                    from: currentUser._id,
                    message: msg
                });
                setMessages((prev) => [...prev, data]);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <Container>
            <div className="container">
                <Contacts 
                    contacts={contacts} 
                    currentUser={currentUser} 
                    chatChange={handleChatChange}
                />
                {currentChat ? (
                    <Chatcontainer 
                        currentChat={currentChat} 
                        currentUser={currentUser}
                        socket={socket}
                        messages={messages}
                        sendMessage={handleSendMessage}
                    />
                ) : (
                    <Welcome currentUser={currentUser} />
                )}
            </div>
            <Logout />
        </Container>
    );
};

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;

    .container {
        height: 85vh;
        width: 85vw;
        background-color: #00000076;
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
    }
`;

export default Chat; 