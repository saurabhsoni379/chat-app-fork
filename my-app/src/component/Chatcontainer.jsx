import React, {useEffect, useState } from 'react'
import styled from 'styled-components'
import { Logout } from './Logout';
import { ChatInput } from './ChatInput';
import { Message } from './Message';

import axios from 'axios';
import {sendMessageRoute,getMessage} from "../utils/APIRoutes"
export const Chatcontainer = ({currentChat, currentUser,socket}) => {
  const [message,setMessage]=useState([]);
  const handleChatMsg=async(msg)=>{
    await  axios.post(sendMessageRoute,{
         message:msg,
         from:currentUser._id,
         to:currentChat._id,
       });
       socket.current.emit("send-msg",{
        from:currentUser._id,
        to:currentChat._id, 
        message:msg
       })
      const msgs=[...message];
      msgs.push({fromSelf:true, message:msg});
      setMessage(msgs);
    
  }
   if(socket.current){
   socket.current.on("data-receive",(msg)=>{
    
    const obj={fromSelf:false,message:msg};
    setMessage((prev)=>[...prev,obj]);
   })}

   useEffect(()=>{
    (async()=>{
      if(currentChat){
       const {data}=await axios.get(getMessage,{
        params:{
        from:currentUser._id,
        to:currentChat._id,}
       })

       setMessage(data)
      }
    })();
  
   },[currentChat])
  
  return (
  <>   {
     currentChat &&
    (
    <Container   >
      <div className="chat-header" >
        <div className="user-detail">
          <div className="avatar" >
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt='avatar'/>
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout  />
      </div>
            <Message msg={message} />
       <ChatInput  chatMsg={handleChatMsg} />
    </Container>
    )
    }
    </>

  )
}

const Container=styled.div`
 display:grid;
 grid-template-rows:10% 78% 12%;
 gap:0.1rem;
overflow:hidden;
.chat-header{
  display:flex;
  justify-content:space-between;
  padding:1rem 2rem;
  border-radius:1rem;
  background-color:#ffffff39;
.user-detail{
  display:flex;
  align-items:center;
 gap:2rem;
  .avatar{
    img{
    height:2.5rem;
    }
  }
  .username{
    color:white;
  }
 }
}
`;
