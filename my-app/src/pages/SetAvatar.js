import React, { useEffect, useState } from 'react'
import loader from "../assets/loader.gif";
import styled from 'styled-components';
import {Bounce, ToastContainer , toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Buffer } from 'buffer';
import axios from 'axios';
import {avatarApi} from "../utils/APIRoutes"
import { useNavigate} from 'react-router-dom'
export const SetAvatar = () => {
   const navigate=useNavigate();
  const api="https://api.multiavatar.com";
    const [avatar,setAvatar]=useState([]);
    const [loding,setLoding]=useState(true);
    const [selected,setSelected]=useState(undefined);
  
    const toastOption={
        position:"bottom-right",
        autoClose:5000,
        draggable:true,
        theme:"light",
        transition:Bounce,
      };
 useEffect(()=>{
 if(!localStorage.getItem("chat-app-user"))
      navigate("/login");
 },[])

  const avatarFetch = async()=>{
    const data=[];
    for(let i=0;i<6;i++){
      try{
        const image=await axios.get(`${api}/${Math.round(Math.random()*100000)}`);  
        const buffer = Buffer.from(image.data,'utf-8');
        data.push(buffer.toString("base64"));
      }
      catch(ex){
        console.log(ex);
      }
      
   }
    setAvatar(data);
    setLoding(false);
   
  }

 useEffect(()=>{
    avatarFetch()

 },[]);

 useEffect(()=>{
  return ()=>{
    setAvatar([]);
    setSelected(undefined);
    
  }
 },[])


 
const setAvatarImage=async()=>{
  if(selected=== undefined)
    toast.error("Please select an avatar", toastOption);
  else{
    const user=await JSON.parse(localStorage.getItem('chat-app-user') );
    const {data}=await axios.post(`${avatarApi}/${user._id}`,{
      image:avatar[selected]
    })
   
    if(data.isSet){
       user.isAvatarImageSet=true;
       user.avatarImage=data.image;
       localStorage.setItem("chat-app-user" ,JSON.stringify( user));
      
       navigate("/");
    }
    
  }
}  
  
  return (
    <>
    {
      loding? <Container>
        <img src={loader} alt="loader" className='loader'/>
      </Container>:(
        <Container>
        <div className='title-container'>
        <h1>Pick an avatar as your prfile picture</h1>
        </div> 
        <div className='avatars'>
         {
          avatar.map((avatar,index)=>{
           return (
            <div 
              key={index}
              className={ `avatar ${selected === index ? "selected" : "" }`}
             
              >
             <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={()=>setSelected(index) } ></img>
            </div>
           )
          })
         }        
        </div>
        <button type='submit' onClick={setAvatarImage}>Set as profile</button>
        <ToastContainer/>
        </Container>
        
      )
    }
       
    </>
  )
}

const Container=styled.div`
 display:flex;
 justify-content:center;
 align-items:center;
  background-color: #131324;
  height:100vh;
  weight:100vw;
  gap:3rem;
  flex-direction:column;

  .title-container{
    h1{
      color:white;
    }
  }
  .avatars::-webkit-scrollbar {
     width: 1.5px;
      height:4px;
      }

   .avatars::-webkit-scrollbar-track {
      display:none;
    }
 
.avatars::-webkit-scrollbar-thumb {
  background: grey; 
  border-radius: 9px;
}


    .avatars{
      display:flex;
      gap:2rem;
      overflow-x:scroll;
      justify-content:center;
      align-items:center;
      width:60vw;
 


    .avatar{
      border:0.4rem solid transparent;
     transition:0.5s ease-in-out;
     border-radius:5rem;
      padding:0.4rem;
      animation: example 20s linear infinite ; 

    img{
      height:6rem;
      cursor:pointer;
     } 
     
    }

    .selected{
        border:0.3rem solid #4e0eff;

     }
    }
    button{
        color:white;
        background-color:#997af0;
        padding:1rem 2rem;
        border-radius:0.5rem;
        cursor:pointer;
        font-weight:bold;
        font-size:1rem;
        transition:0.5s ease-in-out;
        text-transform:uppercase;
        &:hover{
         background-color: #4e0eff;
        }

      }


    @keyframes example {
 0% {
    transform: translateX(-100%); 
  }
  50% {
    transform: translateX(400%); 
  }
  100%{
    transform:translateX(-90%);
  }
   
}
`;
