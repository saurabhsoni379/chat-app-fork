import React, {useState, useEffect,useContext, useRef} from 'react'
import styled  from 'styled-components';
import { useNavigate} from 'react-router-dom'
import axios from  'axios';
import {allusers,host} from "../utils/APIRoutes"
import { Contacts } from '../component/Contacts';
import { Welcome } from '../component/Welcome';
import { Chatcontainer } from '../component/Chatcontainer';
import dlgbx from '../context/dlgbx';
import { DialogBox } from '../component/DialogBox';
import {io} from "socket.io-client"
export const Chat = () => {
  const socket=useRef();
  const navigate=useNavigate();
  const [contacts,setContacts]=useState([]);
  const [currentUser,setCurrentUser]=useState(undefined);
 const [currentChat,setCurrentChat]=useState(undefined);
 const [isLoaded,SetIsLoaded]=useState(false);
const {isdlg}=useContext(dlgbx);
  useEffect(()=>{
    ( async()=>{

       if(!localStorage.getItem("chat-app-user"))
       navigate("/login");
      else
         setCurrentUser(await  JSON.parse(localStorage.getItem("chat-app-user"))); 
          SetIsLoaded(true);
      }) ()  
  },[]);

  useEffect(()=>{
    if(currentUser){
     socket.current=io(host);
     socket.current.emit('add-user',currentUser._id);
    }
  },[currentUser])
  

  useEffect(()=>{
      ( async()=>{
        if(currentUser){
          if(currentUser.isAvatarImageSet){
            const data=await axios.get(
             `${allusers}/${currentUser._id}`
            ) 
            setContacts(data.data);
          }else{
            navigate("/setAvatar");
          }
         }
       })();
  },[currentUser])

 const handleChatChange=(chat)=>{
   setCurrentChat(chat);
 }




  return (
    <Container>
      
    <div className='container' >
    {isdlg && <DialogBox/>}
        <Contacts  contacts={contacts} currentUser={currentUser}  chatChange={handleChatChange} />
          { isLoaded && currentChat === undefined ? <Welcome currentUser={currentUser} /> :(<Chatcontainer currentChat={currentChat} currentUser={currentUser} socket={socket} />) }

      </div>

    </Container>
  )

}
const Container=styled.div`

height:100vh;
width:100vw;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
background-color:#131324;

.container{
 
  height:87vh;
  width:87vw;
  display:grid;
  grid-template-columns:25% 75%;
  background-color:#00000076;
  
    @media screen and (min-width:720px) and (max-width:1080px){
      grid-templete-column:35% 75%;
    }

    @media screen and (min-width:360px) and (max-width:480px){
      grid-templete-column:45% 55%;
    }
}
`;
