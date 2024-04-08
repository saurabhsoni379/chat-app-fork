import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
export const DialogBox = ({SetDialogBox}) => {
    const navigate=useNavigate();
    const handleLogout=async()=>{
         localStorage.clear();
           navigate("/login");
    }
  return (
    <Container >
      <div className="header">
      <h2>Log out</h2></div>
      <hr/>
      <div className="body">
      <h3>Are you sure to Log Out</h3>
      </div>
      <div className="button-section">
    <button className='button confirm' onClick={handleLogout}>Confirm</button>
    <button className='button cancel' onClick={()=>SetDialogBox(false)}>Cancel</button>
    </div>
    </Container>
  )
}

const Container =styled.div`
 height:25%;
 width:40vmin;
 background-color:#9186f3;
 border-radius:1rem;
 padding:1rem ;
 position:absolute;
 z-index:2;
 top:10%;
 left:50%;

 .header{
    h2{
        padding:0.4rem;
    }
 }
 .body{
    padding:1rem 0rem;
 }
 .button-section{
    display:flex;
     gap:1.5rem;
     justify-content:center;
     
   .button{
     padding:0.6rem;
     border-radius:1rem;
     border:none;
     cursor:pointer;
   }
   .cancel{
    background-color:red;
   }
   .confirm{
    background-color:blue;
   }
   }
 

 
`;