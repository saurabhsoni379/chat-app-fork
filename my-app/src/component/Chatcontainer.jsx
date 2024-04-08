import React, {useEffect, useState } from 'react'
import styled from 'styled-components'
import { Logout } from './Logout';
import { ChatInput } from './ChatInput';
import { Message } from './Message';
import { DialogBox } from './DialogBox';
export const Chatcontainer = ({currentChat, setIsOpacityChange}) => {
  const [dialogBox,SetDialogBox]=useState(false);
  const handleChatMsg=(msg)=>{
   alert(msg);
  }

  const handleDialogblox=(event)=>{
   if (event.target === event.currentTarget){
    SetDialogBox(false);
   }
  }

  return (
  <>   {
     currentChat &&
    (
    <Container  onClick={handleDialogblox}  >
      <div className="chat-header" >
        <div className="user-detail">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt='avatar'/>
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout SetDialogBox={SetDialogBox}  setIsOpacityChange={setIsOpacityChange}/>
      </div>
      {
        dialogBox && <DialogBox  SetDialogBox={SetDialogBox} />
       }   
            <Message />
           
      
       <ChatInput  chatMsg={handleChatMsg} />
    </Container>
    )
    }
    </>

  )
}

const Container=styled.div`
 
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
