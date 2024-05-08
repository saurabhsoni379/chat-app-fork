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
  
  const [sender_id,setsender_id]=useState("");
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
    <Container>
      
    <div className='container' >
    {isdlg && <DialogBox/>}
        <Contacts  contacts={contacts} currentUser={currentUser}  chatChange={handleChatChange}  sender_id={sender_id}  />
          { isLoaded && currentChat === undefined ? <Welcome currentUser={currentUser} /> :(<Chatcontainer currentChat={currentChat} currentUser={currentUser} socket={socket}  />) }

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
  
    @media (min-width:500px) and (max-width:1080px){
      grid-template-columns:40% 60%;
     
    }

    @media (min-width:0px) and (max-width:480px){
      grid-template-columns:50% 50%;
      
    }
}
`;
