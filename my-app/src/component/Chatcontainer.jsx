import React, {useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Logout } from './Logout';
import { ChatInput } from './ChatInput';
import { Message } from './Message';
import axios from 'axios';
import {sendMessageRoute, getAllMessageRoute} from "../utils/APIRoutes"
import getCurrentTime from "../utils/TimeFunc"
import { v4 as uuidv4 } from 'uuid';

export const Chatcontainer = ({currentChat, currentUser,socket}) => {
  const [message,setMessage]=useState([]);
  const [arrivalMsg,setArrivalMsg]=useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const lastMessageRef = useRef(null);
  const [msg, setMsg] = useState("");
  const scrollRef = useRef();

  const handleChatMsg=async(msg)=>{
     let currentTime=getCurrentTime();
    await  axios.post(sendMessageRoute,{
         message:msg,
         from:currentUser._id,
         to:currentChat._id,
         time:currentTime,
       });
       socket.current.emit("send-msg",{
        from:currentUser._id,
        to:currentChat._id, 
        message:msg,
        time:currentTime,
       })
      const msgs=[...message];
      msgs.push({fromSelf:true, message:msg,time:currentTime});
      setMessage(msgs);
    
  }
  const valRef = useRef(null);
  useEffect(() => {
    if (currentChat) {
      valRef.current = currentChat._id;
    }
  }, [currentChat]);

    useEffect(() => {
  if (socket.current) {
    socket.current.on("data-receive", async(msg) => {
      
      const val = valRef.current; 
      if (msg.from === val) {
        setArrivalMsg({ fromSelf: false, message: msg.message, time: msg.time });
      }
    });
  }
}, [socket.current]);
    
 
     

     useEffect(()=>{
          
     arrivalMsg && setMessage((prev)=>[...prev,arrivalMsg])
     },[arrivalMsg])

     useEffect(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      } 
        
    }, [message]);

   useEffect(()=>{
    (async()=>{
      if(currentChat){
       const {data}=await axios.get(getAllMessageRoute,{
        params:{
        from:currentUser._id,
        to:currentChat._id,}
       })

       setMessage(data)
      }
    })();
  
   },[currentChat])
  
  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (msg.length > 0) {
      await handleChatMsg(msg);
      setMsg("");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    console.log('Current chat in Chatcontainer:', currentChat);
  }, [currentChat]);

  // Handle typing events
  const handleTyping = () => {
    if (!socket.current || !currentChat) return;

    // Emit typing event
    socket.current.emit("typing", {
      from: currentUser._id,
      to: currentChat._id,
      isTyping: true
    });

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout - changed from 3000 to 1500 (1.5 seconds)
    const timeout = setTimeout(() => {
      if (socket.current) {
        socket.current.emit("typing", {
          from: currentUser._id,
          to: currentChat._id,
          isTyping: false
        });
      }
    }, 800);

    setTypingTimeout(timeout);
  };

  // Listen for typing events
  useEffect(() => {
    if (!socket.current || !currentChat) return;

    const handleTypingEvent = (data) => {
      // Only update typing state if the event is from the current chat user
      if (data.from === currentChat._id) {
        setIsTyping(data.isTyping);
      }
    };

    // Add typing event listener
    socket.current.on("typing", handleTypingEvent);

    return () => {
      socket.current.off("typing", handleTypingEvent);
    };
  }, [currentChat?._id]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  // Reset typing state when chat changes
  useEffect(() => {
    setIsTyping(false);
  }, [currentChat]);

  // Listen for online status changes
  useEffect(() => {
    if (!socket.current) return;

    const handleStatusChange = (data) => {
      if (data.userId === currentChat?._id) {
        setIsOnline(data.status === 'online');
      }
    };

    // Listen for online users list
    const handleOnlineUsersList = (onlineUsers) => {
      if (currentChat && onlineUsers.includes(currentChat._id)) {
        setIsOnline(true);
      }
    };

    // Set up event listeners
    socket.current.on('user-status-change', handleStatusChange);
    socket.current.on('online-users-list', handleOnlineUsersList);

    return () => {
      socket.current.off('user-status-change', handleStatusChange);
      socket.current.off('online-users-list', handleOnlineUsersList);
    };
  }, [currentChat?._id]);

  // Reset online status when chat changes
  useEffect(() => {
    if (socket.current && currentChat) {
      // Request online status for the current chat user
      socket.current.emit('check-online-status', currentChat._id);
    }
    setIsOnline(false);
  }, [currentChat]);

  return (
  <>   {
     currentChat &&
    (
    <Container >
      <div className="chat-header" >
        <div className="user-detail">
          <div className="avatar" >
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt='avatar'/>
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
            <div className="status-container">
              {isTyping && (
                <span className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  typing...
                </span>
              )}
              <span className={`online-status ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? 'online' : 'offline'}
              </span>
            </div>
          </div>
        </div>
        <Logout  />
      </div>
            <Message msg={message} lastMessageRef={lastMessageRef} />
       <ChatInput  chatMsg={handleChatMsg} onTyping={handleTyping} />
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
    display: flex;
    flex-direction: column;
    .status-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 0.2rem;
    }
    .online-status {
      font-size: 0.8rem;
      padding: 0.2rem 0.5rem;
      border-radius: 0.5rem;
      font-style: italic;
      
      &.online {
        color: #4CAF50;
        background-color: rgba(76, 175, 80, 0.2);
      }
      
      &.offline {
        color: #9e9e9e;
        background-color: rgba(158, 158, 158, 0.2);
      }
    }
    .typing-indicator {
      color: #9a86f3;
      font-size: 0.9rem;
      margin-top: 0.2rem;
      font-style: italic;
      background-color: rgba(154, 134, 243, 0.2);
      padding: 0.2rem 0.5rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.2rem;

      .dot {
        width: 4px;
        height: 4px;
        background-color: #9a86f3;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out;
        
        &:nth-child(1) { animation-delay: -0.32s; }
        &:nth-child(2) { animation-delay: -0.16s; }
      }
    }
  }
 }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
`;
