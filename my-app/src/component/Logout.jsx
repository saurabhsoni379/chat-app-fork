import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {BiPowerOff} from 'react-icons/bi'

export const Logout = ({SetDialogBox,setIsOpacityChange }) => {
    const navigate=useNavigate();
     const handleLogOut=()=>{
      SetDialogBox(true);
      setIsOpacityChange(true);
        
     }
  return (
    <Button onClick={handleLogOut}>
        <BiPowerOff/>
    </Button>
  )
}

const Button=styled.button`
display:flex;
justify-content:center;
align-items:center;
padding:0.5rem;
border-radius:0.5rem;
background-color: #9a86f3;
border:none;
cursor:pointer;
svg{
    color:white;
    font-size:1.3rem;
}
`;
