import React, { Component } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import {
  StyledModalText,
  StyledModalH1,
  StyledModalCard,
  StyledModalForm,
  StyledModalLabel,
  StyledModalInput,
  StyledModalButton,
  SDModalMainButtonContainer,
  StyledActionButtonsContainer,
  StyledProgressContainer,
  StyledProgressDot,
  StyledModalContainer,
  StyledModalEnvContainer
} from '../styled-components/StyledModal';

import InviteYourTeamModal from './InviteYourTeamModal';

export default class CreateCompanyModal extends Component {
  state = { open: false };

  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  render() {
    const { open } = this.state;
    return (
      <Modal onOpen={this.open} closeOnEscape="true" onClose={this.close} open={open} trigger={<Button>Create organisation</Button>} basic size="tiny">
        <StyledModalEnvContainer>
          <StyledModalContainer>
            <StyledProgressContainer>
              <StyledProgressDot className="active" />
              <StyledProgressDot />
              <StyledProgressDot />
              <StyledProgressDot />
            </StyledProgressContainer>
            <StyledModalH1>
              <Modal.Header content="Create an organisation" />
            </StyledModalH1>
            <StyledModalCard>
              <Modal.Content>
                <StyledModalText>
                  Organisations are the shared home for your team. Use organisations to get a bird's eye view of discussionsand decisions happening across your organisation.
                </StyledModalText>
                <StyledModalForm>
                  <StyledModalLabel>
                    Organisation name <span className="ligther-font">(Company, nonprofit, school, team)</span>
                  </StyledModalLabel>
                  <StyledModalInput name="orgName" type="text" />
                </StyledModalForm>
              </Modal.Content>
              <Modal.Actions>
                <StyledActionButtonsContainer>
                  <InviteYourTeamModal />
                  <SDModalMainButtonContainer>
                    <StyledModalButton className="cancel-button" onClick={this.close}>
                      Cancel
                    </StyledModalButton>
                  </SDModalMainButtonContainer>
                </StyledActionButtonsContainer>
              </Modal.Actions>
            </StyledModalCard>
          </StyledModalContainer>
        </StyledModalEnvContainer>
      </Modal>
    );
  }
}

//Stylin
