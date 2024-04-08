import React, {useState, useEffect, useRef} from 'react'
import styled  from 'styled-components';
import {Await, Link, useNavigate} from 'react-router-dom'
import axios from  'axios';
import {allusers} from "../utils/APIRoutes"
import { Contacts } from '../component/Contacts';
import { Welcome } from '../component/Welcome';
import { Showdp } from './Showdp';
import { Chatcontainer } from '../component/Chatcontainer';
export const Chat = () => {
  const navigate=useNavigate();
  const [contacts,setContacts]=useState([]);
  const [currentUser,setCurrentUser]=useState(undefined);
 const [currentChat,setCurrentChat]=useState(undefined);
 const [showDp,setShowDp]=useState(undefined);
 const [isLoaded,SetIsLoaded]=useState(false);
 const [isOpacityChange,setIsOpacityChange]=useState(false);
 const changeopacity=useRef(null);
  useEffect(()=>{
    ( async()=>{

       if(!localStorage.getItem("chat-app-user"))
       navigate("/login");
      else
         setCurrentUser(await  JSON.parse(localStorage.getItem("chat-app-user"))); 
          SetIsLoaded(true);
      }) ()  
  },[]);
  // useEffect(()=>{
  //   if(isOpacityChange)
  // changeopacity.current.style.opacity=0.5;
  // },[isOpacityChange])
  

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

 const handleShowDp=(image)=>{
  setShowDp(image);
}


  return (
    <Container>
    <div className='container' ref={changeopacity}>
        <Contacts  contacts={contacts} currentUser={currentUser}  chatChange={handleChatChange} dpChange={handleShowDp}/>
          { isLoaded && currentChat === undefined ? <Welcome currentUser={currentUser} /> :(<Chatcontainer currentChat={currentChat} setIsOpacityChange={setIsOpacityChange} />) }
        {/* {
      showDp ?
      <Showdp image={showDp}/>: <Welcome currentUser={currentUser} />
         
     } */}
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
  z-index:0;
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
