import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import  Logo from "../assets/logo.svg";
export const Contacts = ({contacts,currentUser,chatChange}) => {
    const [currentUserName,setCurrentUserName]=useState(undefined);
    const [currentUserImage,setCurrentUserImage]=useState(undefined);
    const [currentSelected,setCurrentSelected]=useState(undefined);
    useEffect(()=>{
     if(currentUser){
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
     }
    },[currentUser]);

    const changeCurrentChat=(index,contact)=>{
      
      setCurrentSelected(index);
     chatChange(contact);
   
    }
 
   
 
    
   
    
  return (
    <>
     {
       currentUserImage && currentUserName && 
       <Container>
          <div className='brand'>
           <img src={Logo} alt="logo" />
           <h2>snappy </h2>
          </div>
          <div className='contacts'>
          {  contacts.length>0 && (
            contacts?.map((contact,index)=>{
             return ( 
           <div key={index} className= {`contact ${index === currentSelected ? 
           "selected":"" } ` }   onClick={()=>{ changeCurrentChat(index,contact);}} >
             <div className='avatar'      >
             <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar"  ></img>
       
             </div>
             <div className='name_msg'>
             <div className='username'>
               <h3>{contact.username}</h3>
                
             </div>
              
              </div>
           </div>
           )
            }))
          }
   
          </div>
          <div className="current-user">
            <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar"></img>
            </div>
            <div className="username">
            <h2>{currentUserName}</h2>
            </div>
          </div>
         
       </Container>
     }

    </>
  )
}

const Container=styled.div`
display:grid;
grid-template-rows:10% 75% 15%;
overflow:hidden;   
background-color:#080420;
gap:0.5rem;
.brand{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:1rem;
  img{
    height:3.5rem;
  }
 
  h2{
    color:white;
    text-transform:uppercase;
    font-size:2rem;
  }
  }
  .contacts{ 
    display:flex;
    flex-direction:column;
    overflow:auto;
    gap:0.8rem;
    .contact{
       display:flex;
       align-items:center;
       gap:2rem;
       min-height:5rem;
      background-color:#ffffff39;
       cursor:pointer;
      width:95%;
      padding:0.4rem;
      transition:0.5s ease-in-out;
      img{
        height:2.5rem;
        transition:0.5s ease-in-out;
      }
      .name_msg{
        width:100%;
       display:flex;
       justify-content:space-between;
       padding:0.3rem;
       
          h3{
      
        color:white;
      }
      
      }
      
    }
    .selected{
        background-color:#9186f3;
      }
     &::-webkit-scrollbar{
       width:0.2rem;
       &-thumb{
        background-color:#ffffff39;
        
       }
     } 
  }

  .current-user{
    display:flex;
    align-items:center;
    gap:1.5rem;
    padding:0.5rem;
    img{
      height:3.5rem;
    }
    h2{
      color:white;
    }
  }
  @media screen and (min-width:720px) and (max-width:1080px){
    html {
  font-size: 12px;
}
  
    .username{
      h2{
        font-size:1rem;
      }
    }
  }
  

    @media screen and (min-width:360px) and (max-width:480px){
      html{
      font-size:8px;
      }
    }

 
`;
  
