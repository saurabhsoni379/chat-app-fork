import React from 'react'
import styled from 'styled-components';

export const Showdp = ({image}) => {
  return (
    <Container>
    <div className='showdp'>
    <img  src={`data:image/svg+xml;base64,${image}`} alt="image"></img>
 </div>
 </Container>
  )
}
const Container=styled.div`
    display:flex;
  align-items:center;
  justify-content:center;

  img{
    height:20rem;
  }
   
`;
