import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import styled from 'styled-components';
import logo from '../assets/logo.svg'
import {Bounce, ToastContainer , toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {loginApi} from "../utils/APIRoutes"

export const Login = () => {
  const navigate=useNavigate();
  const [value,Setvalue]=useState({
      username:"",
      password:"",
});
 const toastOption={
  position:"bottom-right",
  autoClose:5000,
  draggable:true,
  theme:"light",
  transition:Bounce,

   };
   useEffect(()=>{
   if(localStorage.getItem("chat-app-user")){
    navigate("/");
   }
   },[]);
    const handleSubmit= async(e)=>{
        e.preventDefault();
      if(handleValidation()){
        const {password,username}=value;
        const {data}=await  axios.post(loginApi,{
          password,username
        })
      
        if(data.status=== false)
        toast.error(data.msg,toastOption);

      if(data.status === true){
        localStorage.setItem("chat-app-user",JSON.stringify(data.user));
        navigate("/"); 
      }
      };

    }
  //validatiaon
    const handleValidation=()=>{
        const {password,username}=value;
        if(password === "" || username === ""){
          toast.error(' username and password required',   toastOption);
          return false;
        } 

        return true;


    }

    const handleChange=(e)=>{
        Setvalue({...value,[e.target.name]:e.target.value});
    }
  return (
    <>
    <FormContainer>
    <form onSubmit={(e)=>{handleSubmit(e)}}>
    <div className='brand'>
    <img src={logo} alt='logo' />
        <h1>snappy</h1>
    </div>
    <input type='text' placeholder='Username' name='username' onChange={(e)=>handleChange(e)}></input>
   
    <input type='password' placeholder='Password' name='password' onChange={(e)=>handleChange(e)}></input>
    <button type='submit' >Login</button>
    <span>Don't have an account ? <Link to="/register"> Register</Link></span>
    </form>
    <ToastContainer/>
    </FormContainer>
    

    </>
  )
}
 const FormContainer = styled.div`
  height:100vh;
   display:flex;
   justify-content: center;
   align-items: center;
   background-color:#131324;
   gap: 1rem;
   .brand{
    gap:1rem;
    display:flex;
    justify-content: center;
    align-item:center;
    img{
      height:5rem;
    }
    h1{
      color:white;
      text-transform: uppercase;
    }
   }
   form{
      display:flex;
      flex-direction:column;
      gap:2rem;
      background-color:#00000076;
      border-radius:1rem;
      padding:3rem 5rem;
      input{
        background-color:transparent;
        padding:1rem;
         border: 0.1rem solid #4e0eff;
         border-radius:0.4rem;
         color:white;
       font-size:1rem;

       &:focus{
        border: 0.1rem solid #997af0;
        outline:none;
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

      span{
        color:white;
        text-transform: uppercase;
        font-weight:bold;
        a{
          color:#4e0eff;
          text-decoration:none;
          font-weight:bold;
          
        }
      }
 
   }
   .Toastify__toast {
        background-color:#00000076;
}
 `;