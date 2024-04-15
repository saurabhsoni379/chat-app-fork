import React , {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {BiPowerOff} from 'react-icons/bi'
import dlgbx from '../context/dlgbx'
export const Logout = () => {
    const navigate=useNavigate();
    const {setIsDlg}=useContext(dlgbx);
     const handleLogOut=()=>{
         setIsDlg(true);
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
padding:0.3rem;
border-radius:0.5rem;
background-color: #9a86f3;
border:none;
cursor:pointer;
svg{
    color:white;
    font-size:1.3rem;
}
`;
