import styled from 'styled-components';

export const StyledLogin = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  padding-top: 50px;
  background-color: #fff7f3;
`;

export const StyledLoginCon = styled.div`
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledForm = styled.form`
  width: 450px;
  padding: 30px 20px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  -webkit-box-shadow: 0px 15px 35px -34px rgba(92, 92, 91, 1);
  -moz-box-shadow: 0px 15px 35px -34px rgba(92, 92, 91, 1);
  box-shadow: 0px 15px 35px -34px rgba(92, 92, 91, 1);
  @media screen and (max-width: 500px) {
    max-width: 95vw;
    font-size: 1rem;
  }
`;

export const StyledInput = styled.input`
  width: 70%;
  border: none;
  border-bottom: 2px solid lightgray;
  padding: 5px 0;
  margin-bottom: 10px;
  &:focus {
    border-bottom: 2px solid #00bc98;
    outline: none;
  }
`;

export const StyledLabel = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledLowerSignIn = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledLowerSignInPasswordless = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const StyledIcon = styled.img`
  height: 16px;
  width: 16px;
  position: absolute;
  top: 4px;
  right: 0;
  z-index: 2;
  cursor: pointer;
`;
