import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { BsEmojiSmileUpsideDown } from "react-icons/bs"
import { IoMdSend } from "react-icons/io"
import EmojiPicker from 'emoji-picker-react'

export const ChatInput = ({ chatMsg, onTyping }) => {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
    // Trigger typing event when emoji is added
    if (onTyping) {
      onTyping();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (msg.length > 0) {
      await chatMsg(msg);
      setMsg("");
      // Clear typing timeout when message is sent
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
    // Trigger typing event
    if (onTyping) {
      onTyping();
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileUpsideDown onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
          {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={handleChange}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    
    .emoji {
      position: relative;
      
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          
          &-thumb {
            background-color: #9a86f3;
          }
        }
        
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    
    input {
      width: 90%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      
      &::selection {
        background-color: #9a86f3;
      }
      
      &:focus {
        outline: none;
      }
    }
    
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

