import React ,{useContext} from  'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import dlgbx from '../context/dlgbx'

export const DialogBox = () => {
    const navigate=useNavigate();
    const {isdlg,setIsDlg}=useContext(dlgbx);

    const handleLogout=async()=>{
         localStorage.clear();
           navigate("/login");
           setIsDlg(false)
    }
     const closeWindow=(e)=>{
      console.log(e.target.id)
      if(e.target.id==='mainDiv'){
        
        setIsDlg(false)
      }
     }
  return (
    <Container   onClick={closeWindow} id='mainDiv'>
     <div className={`dialogBox ${isdlg ? 'show' : ''}`}>
     
      <div className="header">
      <h2>Log out</h2></div>
      <hr/>
      <div className="body">
      <h3>Are you sure to Log Out</h3>
      </div>
      <div className="button-section">
    <button className='button confirm' onClick={handleLogout}>Confirm</button>
    <button className='button cancel' onClick={()=>setIsDlg(false)}>Cancel</button>
    </div>

    </div>
  
    </Container>
  )
}

const Container =styled.div`
    display:flex;
    justify-content: center;
 
    height:100%;
    width: 100%;
  position:absolute;   
  background-color: rgba(10, 5, 5, 0.2);

  
 .dialogBox{
  opacity:0.3;
  transition:opacity 0.5s ease-in-out;
  height:30vmin;
 width:45vmin;
 background-color:#9186f3;
 border-radius:0.3rem;
 padding:1rem ;
 top:30%;
 left:50%;
 color:white;


 .header{
    h2{
        padding:0.4rem;
        text-transform:uppercase;  
    }
 }
 .body{
  
    padding:2rem 0rem;
    
 }
 .button-section{
    display:flex; 
     justify-content:space-between;
     
   .button{
     padding:0.6rem;
     border-radius:0.3rem;
     border:none;
     cursor:pointer;
     color:white;
   }
   .cancel{
    background-color:red;
   }
   .confirm{
    background-color:blue;
   }
   }
 }


 &:hover  .dialogBox{
  opacity:1;
 }

 

`;