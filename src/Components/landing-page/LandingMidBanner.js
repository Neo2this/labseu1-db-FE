import React from 'react';
import styled from 'styled-components';

//Import icons/images

//Import components

//Main component
export default class LandingMidBanner extends React.Component {
  render() {
    return (
      <StyledMidBanner>
        <h1>Better discussions, better decisions.</h1>
        <div>Get your team on Pinely today and start moving forward, together.</div>
        <div>
          <input />
          <button>submit</button>
        </div>
      </StyledMidBanner>
    );
  }
}

const StyledMidBanner = styled.div`
  margin-top: 10vh;
  width: 100%;
  padding: 5vh 15vw;
  background-color: #308c6633;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h1 {
    font-size: 2.5rem;
    text-align: center;
  }
  div {
    font-size: 1.2rem;
    padding-top: 10px;
    text-align: center;
  }

  input {
    border-radius: 15px;
    border: none;
    margin: 15px 15px 10px 0px;
    padding: 5px 15px;
    min-width: 20%;
  }

  button {
    padding: 5px 15px;
    background-color: #308c66;
    color: white;
    border-radius: 15px;
    border: none;
    cursor: pointer;
    &:disabled {
      background-color: lightgray;
    }
  }
`;