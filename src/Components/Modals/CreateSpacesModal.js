import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import styled from 'styled-components';

//Import components
import ProgressBar from '../reusable-components/ProgressBar';

export default class CreateSpacesModal extends Component {
  spacesExamples = [
    { name: 'Product', color: 'eggplant' },
    { name: 'Engineering', color: 'darkgreen' },
    { name: 'Recruiting', color: 'violet' },
    { name: 'Design', color: 'darkolive' },
    { name: 'Marketing', color: 'yellow' },
    { name: 'Reviews', color: 'red' },
    { name: 'Announcements', color: 'lightblue' },
    { name: 'Research', color: 'green' }
  ];

  state = {
    chosenSpaces: [],
    firstInputForSpace: '',
    secondInputForSpace: ''
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  addSpace = space => {
    const indexOfSpace = this.state.chosenSpaces.indexOf(space);
    console.log(indexOfSpace);
    if (indexOfSpace > -1) {
      const arrayWithoutSpace = this.state.chosenSpaces.filter(s => {
        return s !== space;
      });
      this.setState({ chosenSpaces: arrayWithoutSpace });
    } else {
      this.setState(pr => ({
        chosenSpaces: [...pr.chosenSpaces, space]
      }));
    }
  };

  addSpacesFromInput = (space1, space2) => {
    const arrayWithPushedSpace = this.state.chosenSpaces.push(space1, space2);
    this.setState(pr => ({
      chosenSpaces: arrayWithPushedSpace
    }));
  };

  //Render component
  render() {
    return (
      <Modal open={this.props.shoudlBeOpen} basic size="tiny">
        <ProgressBar activeDots={3} bulletpoints={3} />
        <StyledModalH1>
          <Modal.Header content="Create few spaces" />
        </StyledModalH1>
        <StyledModalCard>
          <Modal.Content>
            <StyledModalForm>
              <StyledModalLabel>Set up spaces for your team</StyledModalLabel>
              <StyledModalTextInForm>Spaces are your team's virtual meeting rooms. Use them to have discussions about specific projects and broader team topics.</StyledModalTextInForm>
              <StyledModalLabel>
                Choose a few spaces <span>{`${this.state.chosenSpaces.length} selected`}</span>
              </StyledModalLabel>
              <StyledModalSpacesContainer>
                {this.spacesExamples.map(s => {
                  return (
                    <StyledSpacesModalCard
                      className={`${this.state.chosenSpaces.indexOf(s.name) > -1 && 'borderclass'} ${s.color}`}
                      key={s.name}
                      onClick={() => {
                        console.log(this.state.chosenSpaces.indexOf(s.name));
                        this.addSpace(s.name);
                      }}>
                      {s.name}
                    </StyledSpacesModalCard>
                  );
                })}
              </StyledModalSpacesContainer>
              <StyledModalLabel>Create a few spaces</StyledModalLabel>
              <StyledModalTextInForm>Start with current projects, ongoning discussion topics, or anything else you would have a meeting about.</StyledModalTextInForm>
              <StyledModalInput placeholder="ie. Products Proposals" name="firstInputForSpace" onChange={this.handleInputChange} value={this.state.firstInputForSpace} />
              <StyledModalInput placeholder="ie. Design Review" name="secondInputForSpace" onChange={this.handleInputChange} value={this.state.secondInputForSpace} />
            </StyledModalForm>
          </Modal.Content>
          <Modal.Actions>
            <StyledActionButtonsContainer>
              <StyledModalButton
                onClick={e => {
                  e.preventDefault();
                  this.addSpacesFromInput(this.state.firstInputForSpace, this.state.secondInputForSpace);
                  this.props.showModal('null');
                  this.props.addCreatedSpaces(this.state.chosenSpaces);
                }}>
                Finish
              </StyledModalButton>
              <StyledModalMainButtonContainer>
                <StyledModalButton
                  className="cancel-button"
                  onClick={e => {
                    e.preventDefault();
                    this.props.showModal('InviteYourTeamModal');
                  }}>
                  Back
                </StyledModalButton>
              </StyledModalMainButtonContainer>
            </StyledActionButtonsContainer>
          </Modal.Actions>
        </StyledModalCard>
      </Modal>
    );
  }
}

const StyledModalH1 = styled.h1`
  font-family: 'Open Sans', sans-serif;
  text-align: center;
  font-weight: 300;
`;

const StyledModalCard = styled.div`
  background-color: white;
  margin-top: 50px;
  border-radius: 5px;
  input:focus,
  button:focus,
  textarea:focus {
    outline: none;
  }
`;

const StyledModalForm = styled.form`
  padding: 25px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 20px;
  .heading {
    padding-bottom: 40px;
  }
`;

const StyledModalLabel = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  padding-bottom: 10px;
  color: black;
  .ligther-font {
    font-size: 0.8rem;
    color: #bdc3c9;
  }
`;
const StyledModalInput = styled.input`
  width: 98%;
  border: none;
  border-bottom: 2px solid #bdc3c9;
  padding: 10px 0 5px 0;
  margin-bottom: 10px;
  &::placeholder {
    font-size: 1.2rem;
  }
`;

const CharacterLeft = styled.div`
  width: 2%;
  padding-left: 3px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #bdc3c9;
`;

const StyledModalButton = styled.button`
  width: 100px;
  padding: 5px 15px;
  margin: 0 25px 25px 0;
  color: white;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  background-color: #5c4df2;
`;

const StyledActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row-reverse;
`;

const StyledModalMainButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  .cancel-button {
    color: #5c4df2;
    background-color: white;
    border: 2px solid #5c4df2;
  }
`;

const StyledModalTextInForm = styled.div`
  line-height: 1.6;
  color: black;
  padding-bottom: 25px;
`;

const StyledModalSpacesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  .eggplant {
    background-color: #403b4f;
  }
  .darkgreen {
    background-color: #2e7c87;
  }
  .violet {
    background-color: #5c44f2;
  }
  .darkolive {
    background-color: #36484e;
  }
  .yellow {
    background-color: #d99e49;
  }
  .red {
    background-color: #f26551;
  }
  .lightblue {
    background-color: #19a9e3;
  }
  .green {
    background-color: #19bd98;
  }
  .borderclass {
    border: 2px solid #5c4df2;
  }
`;

const StyledSpacesModalCard = styled.div`
  width: 24%;
  color: white;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
