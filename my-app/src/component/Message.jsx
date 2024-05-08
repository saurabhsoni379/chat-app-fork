import React from 'react'
import styled from 'styled-components'

export const Message = ({msg,lastMessageRef}) => {
  
  return (
    <Container>
       {
        msg.map((msg,index)=>{
          return (
            <div key={index} className={`message ${msg.fromSelf ? "sender": "receiver"}`}>
            <div className="content">
             <p>{msg.message} </p>
              <div className="time"> 
             <span>{ msg.time }
             </span>
             </div>
            </div>
            </div>
          )
        })
       }
         <div ref={lastMessageRef}></div>
    </Container>
  )
}
const Container=styled.div`

padding:1rem 2rem;
overflow:auto;
display:flex;
flex-direction:column;
gap:1rem;
color:white;

&::-webkit-scrollbar{
   
       width:0.4rem;
       &-thumb{
        background-color:#ffffff39;
        cursor:pointer;
       }
     }
.message{
  display:flex;
  align-items:center;
  .content{
    max-width:25vmax;
    padding:1rem;
    overflow-wrap:break-word;
    font-size:1rem;
    padding:1rem;
    border-radius:1rem;
    .time{
      display:flex;
      justify-content:flex-end;
      
    }
    span{
      font-size:0.7rem;
      margin-left: 20px;
      padding:0.3rem;
      color:grey;
    }
  }
}
.sender{
  justify-content:flex-end;
  .content{
    background-color:#4f04ff21;
  }

}
.receiver{

  .content{
  background-color:#9900ff20;}
}
 



`;
