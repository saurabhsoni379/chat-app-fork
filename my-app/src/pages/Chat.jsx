import React, {useState, useEffect,useContext, useRef} from 'react'
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate} from 'react-router-dom'
import axios from  'axios';
import {allUsersRoute, host, contactRoute} from "../utils/APIRoutes"
import { Contacts } from '../component/Contacts';
import Welcome from '../component/Welcome';
import { Chatcontainer } from '../component/Chatcontainer';
import dlgbx from '../context/dlgbx';
import { DialogBox } from '../component/DialogBox';
import {io} from "socket.io-client"

// Global style to prevent horizontal scrolling anywhere in the app
const GlobalStyle = createGlobalStyle`
  html, body {
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
  }
`;

export const Chat = ({ currentUser }) => {
  const socket=useRef();
  const navigate=useNavigate();
  const [contacts,setContacts]=useState([]);
  const [sender_id,setsender_id]=useState("");
  const [currentChat,setCurrentChat]=useState(undefined);
  const [isLoaded,SetIsLoaded]=useState(false);
  const {isdlg}=useContext(dlgbx);

  useEffect(()=>{
    if(!currentUser) {
      navigate("/login");
    } else {
      SetIsLoaded(true);
    }
  },[currentUser]);

  useEffect(()=>{
    if(currentUser){
     socket.current=io(host);
     socket.current.emit('add-user',currentUser._id);
    }
  },[currentUser])
  
  // Listen for contact updates
  useEffect(() => {
    if (socket.current) {
      socket.current.on("contact-update", (data) => {
        console.log("Received contact update:", data);
        if (data.status === 'accepted') {
          // Refresh contacts when a contact request is accepted
          refreshContacts();
        }
      });
    }
    
    return () => {
      if (socket.current) {
        socket.current.off("contact-update");
      }
    };
  }, [socket.current, currentUser]);
  
  // Function to refresh contacts
  const refreshContacts = async () => {
    if (!currentUser) return;
    
    try {
      console.log("Refreshing contacts...");
      const data = await axios.get(`${contactRoute}/${currentUser._id}`);
      console.log('Updated contacts:', data.data);
      setContacts(data.data);
    } catch (error) {
      console.error("Error refreshing contacts:", error);
    }
  };
  
  useEffect(()=>{
    ( async()=>{
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const data = await axios.get(
           `${contactRoute}/${currentUser._id}`
          ) 
          console.log('Fetched contacts from server:', data.data);
          
          if (data.data.length > 0) {
            console.log('First contact:', data.data[0]);
            console.log('Contact usernames:', data.data.map(c => c.username));
          }
          
          setContacts(data.data);
        }else{
          navigate("/setAvatar");
        }
      }
    })();
  },[currentUser])

  const handleChatChange=(chat)=>{
    console.log('Selected chat:', chat);
    setCurrentChat(chat);
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("data-receive", (msg) => {
        setsender_id(msg.from);
      });
    }
  }, [socket.current]);

  useEffect(()=>{
    const sortedContacts = [...contacts].sort((a, b)=> {
      if(a._id===sender_id && b._id!==sender_id)return -1;
      if(a._id!==sender_id && b._id===sender_id)return 1;
      else return 0;
    }) 
    setContacts(sortedContacts);
  },[sender_id])

  return (
    <>
      <GlobalStyle />
      <Container>
        <div className='container' >
          {isdlg && <DialogBox/>}
          <Contacts  
            contacts={contacts} 
            currentUser={currentUser}  
            chatChange={handleChatChange}  
            sender_id={sender_id}  
          />
          {isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser} /> 
          ) : (
            <Chatcontainer 
              currentChat={currentChat} 
              currentUser={currentUser} 
              socket={socket}  
            />
          )}
        </div>
      </Container>
    </>
  )
}

const Container=styled.div`
  width:100vw;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  background-color:#131324;
  box-sizing: border-box;
  max-width: 100%;

  .container{
    height:87vh;
    width:87vw;
    display:grid;
    grid-template-columns:25% 75%;
    background-color:#00000076;
    overflow: hidden;
    
    @media (min-width:500px) and (max-width:1080px){
      grid-template-columns:40% 60%;
    }

    @media (min-width:0px) and (max-width:480px){
      grid-template-columns:50% 50%;
    }
  }
`;
