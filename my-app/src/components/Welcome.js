import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';

const Welcome = ({ currentUser }) => {
    return (
        <Container>
            <div className="welcome">
                <Avatar
                    src={currentUser.avatarImage}
                    alt={currentUser.username}
                    sx={{ width: 100, height: 100 }}
                />
                <h1>
                    Welcome, <span>{currentUser.username}!</span>
                </h1>
                <h3>Please select a chat to start messaging.</h3>
            </div>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
    .welcome {
        h1 {
            font-size: 3rem;
            color: white;
            span {
                color: #4e0eff;
            }
        }
        h3 {
            color: #4e0eff;
        }
    }
`;

export default Welcome; 