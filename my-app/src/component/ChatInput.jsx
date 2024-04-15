import React, { useState } from 'react'
import styled from 'styled-components'
import Picker from "emoji-picker-react"
import {IoMdSend} from "react-icons/io"
import {BsEmojiSmileFill} from "react-icons/bs"
export const ChatInput = ({chatMsg}) => {
    const [msg,setMsg]=useState("");
    const [emoji,setEmoji]=useState(false);
     function handleEmojiPickerOnOff(){
        setEmoji(!emoji);
     }
     const handleSumbit=(event)=>{
   event.preventDefault();
    if(msg.length>0){
      chatMsg(msg);
      setMsg('');
    }
     }
     const handleEmoji=(emojiData,event)=>{
          let message=msg;
        
          message+=emojiData.emoji;
          
         
          setMsg(message);
     }
  return (
    <Container>
        <div className="button-container">
       
            <div className='emoji'>
           
                <BsEmojiSmileFill onClick={handleEmojiPickerOnOff}/>
                {emoji && <Picker  width="15rem" height="18rem"   onEmojiClick={handleEmoji} />}
            </div>
          
            
        </div>
       
        <form className='input-container' onSubmit={handleSumbit}>
         <input type='text' placeholder='type your message here!' value={msg} onChange={(e)=>setMsg(e.target.value)}/>
        <button className='submit' type='submit'>
            <IoMdSend/>
        </button>
        </form>
        
    </Container>
  )
}
const Container=styled.div`
 display: grid;
grid-template-columns: 5% 95%;


padding:0rem 2rem 0.3rem 2rem;
height:2.5rem;
 .button-container{
    .emoji{
    display:flex;
    align-items:center;
   position:relative;
    svg{
        color:yellow;
        font-size:1.5rem;
        cursor:pointer;
    }
    
    .EmojiPickerReact{

      --epr-emoji-size:1.3rem;
      --epr-preview-height:36px;
      --epr-category-label-bg-color: #080420;
     
        position:absolute;
        background-color:#080420;
        top:-19rem;
        box-shadow:0 5px 10px #9a86f3;
        --epr-header-padding:4px;
        input{
          height:1.5rem;
          background-color:transparent;
          border-color:#9186f3;
        }
       .epr-body::-webkit-scrollbar{
       width:0.2rem;
       &-thumb{
        background-color:#ffffff39;
        
       }
     } 
        
       
       
    }
    }
 }
 .input-container{
    width:100%;
   height:90%;
    background-color:#ffffff34;
    display:flex;
    align-items:center;
    border-radius:2rem;
    gap:2rem;
  input{
padding:0 1rem;
    background-color:transparent;
     width:90%;
     height:80%;
     color:white;
     border:none;
     font-size:1rem;
     &::selection{
        background-color:#9a86f3;
     }
     &:focus{
        outline:none;
       }
  }
  button{
    display:flex;
    align-items:center;
    justify-content:center;
    padding:0.4rem  1rem;
    border-radius:2rem;
    border:none;
    background-color:#9a86f3;
    svg{
        font-size:1.2rem;
        cursor:pointer;
    }
  }  
 }
`;

