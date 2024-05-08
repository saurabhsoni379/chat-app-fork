import React from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'
export const Welcome = ({currentUser}) => {
  return (
   <Container>
     <img src={Robot} alt="robot"></img>
     <h1>Welcome ,  <span> {currentUser.username}</span>
     </h1>
     <h4>Please select a chat to Start Messaging</h4>
   </Container>
  )
}

const Container=styled.div`
overflow:hidden;
 display:flex;
 justify-content:center;
 align-items:center;
 color:white;
 flex-direction:column;
 img{
   height:25vmax;
 }
 span{
    color:#4e0eff
 }
  @media (min-width:0px) and (max-width:480px){
     html{
      font-size:13px;
     }
      
    }
 `;
