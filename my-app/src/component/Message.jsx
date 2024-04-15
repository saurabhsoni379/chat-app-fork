import React from 'react'
import styled from 'styled-components'

export const Message = ({msg}) => {
  
  return (
    <Container>
       {
        msg.map((msg,index)=>{
          return (
            <div key={index} className={`message ${msg.fromSelf ? "sender": "receiver"}`}>
            <div className="content">
             <p>{msg.message}</p>
            </div>
            </div>
          )
        })
       }
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
.message{
  display:flex;
  align-items:center;
  .content{
    max-width:40%;
    padding:1rem;
    overflow-wrap:break-word;
    font-size:1rem;
    padding:1rem;
    border-radius:1rem;
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
