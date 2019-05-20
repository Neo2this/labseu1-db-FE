import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty, withFirestore } from 'react-redux-firebase';
import { Button, Icon, Message } from 'semantic-ui-react';
import uuid from 'uuid';

import { StyledButton } from './styled-components/StyledButton';
import {
  StyledLogin,
  StyledForm,
  StyledInput,
  StyledLabel,
  StyledLoginCon,
  StyledLowerSignIn
} from './styled-components/StyledLogin';
import { StyledH1, StyledLink, StyledPLabel } from './styled-components/StyledText';
import Spinner from './semantic-components/Spinner';
import LoginAnimation from './animations/LoginAnimation';

class Register extends Component {
  static propTypes = {
    auth: PropTypes.object,
    firebase: PropTypes.shape({
      login: PropTypes.func.isRequired,
      logout: PropTypes.func.isRequired
    })
  };

  state = {
    email: '',
    password: '',
    fullName: '',
    error: null
  };

  componentWillUpdate() {
    if (!isLoaded(this.props.auth)) {
      return <Spinner />;
    }
    if (isLoaded(this.props.auth) && !isEmpty(this.props.auth)) {
      this.props.history.push('/homescreen');
    }
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  saveUserToDatabaseAndToLocalStorageWhenUsingGoogleSignIn = res => {
    let userId = uuid();
    localStorage.setItem('uuid', userId);
    localStorage.setItem('userEmail', res.profile.email);
    this.props.firestore
      .collection('users')
      .doc(userId)
      .set({
        fullName: res.profile.displayName,
        userEmail: res.profile.email,
        profileUrl: res.profile.avatarUrl,
        arrayOfOrgsNames: [],
        arrayOfOrgsIds: [],
        arrayOfSpaceIds: [],
        arrayOfSpaceNames: []
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  };

  saveUserToDatabaseAndToLocalStorage = res => {
    let userId = uuid();
    localStorage.setItem('uuid', userId);
    localStorage.setItem('userEmail', this.state.email);
    this.props.firestore
      .collection('users')
      .doc(userId)
      .set({
        fullName: this.state.fullName,
        userEmail: res.user.user.email,
        profileUrl: 'http://lorempixel.com/640/480',
        arrayOfOrgsNames: [],
        arrayOfOrgsIds: [],
        arrayOfSpaceIds: [],
        arrayOfSpaceNames: []
      })
      .then(res => {
        const orgRef = this.props.firestore
          .collection('organisations')
          .where('arrayOfUsersEmails', 'array-contains', this.state.email);
        orgRef
          .get()
          .then(qs => {
            qs.forEach(doc => {
              this.saveUserIdInOrg(doc.id, userId);
              this.saveOrgNameAndOrgIdInUser(doc.id, doc.data().orgName, userId);
              localStorage.setItem('activeOrg', doc.id);
            });
          })
          .catch(function(error) {
            console.log('Error getting documents: ', error);
          });
      })

      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  };

  createAndLogInNewUser = e => {
    const { email, password, fullName } = this.state;
    const INITIAL_STATE = {
      email: '',
      password: '',
      fullName: '',
      error: null
    };

    e.preventDefault();
    this.props.firebase
      .createUser({ email, password }, { fullName, email })
      .then(() => {
        this.props.firebase
          .login({ email, password })
          .then(res => {
            this.saveUserToDatabaseAndToLocalStorage(res);
          })
          .catch(error => {
            this.setState({ ...INITIAL_STATE, error });
          });
      })
      .catch(error => this.setState({ ...INITIAL_STATE, error: error }));
  };

  saveUserIdInOrg = (orgId, userId) => {
    this.props.firestore
      .collection('organisations')
      .doc(orgId)
      .update({
        arrayOfUsersIds: this.props.firestore.FieldValue.arrayUnion(userId)
      })
      .catch(err => console.log(err));
  };

  saveOrgNameAndOrgIdInUser = (orgId, orgName, userId) => {
    this.props.firestore
      .collection('users')
      .doc(userId)
      .update({
        arrayOfOrgsNames: this.props.firestore.FieldValue.arrayUnion(orgName),
        arrayOfOrgsIds: this.props.firestore.FieldValue.arrayUnion(orgId)
      })
      .catch(err => console.log(err));
  };

  render() {
    const { email, password, fullName } = this.state;
    const isInvalid = email === '' || password === '' || fullName === '';

    if (!isLoaded(this.props.auth)) {
      return <Spinner />;
    }
    if (!isEmpty(this.props.auth)) {
      return null;
    }
    return (
      <StyledLogin>
        <StyledLoginCon>
          <StyledH1>Register</StyledH1>
          <StyledForm onSubmit={this.createAndLogInNewUser}>
            <StyledLabel>
              <StyledPLabel>Full Name</StyledPLabel>
              <StyledInput
                name="fullName"
                value={this.state.fullName}
                type="text"
                onChange={this.handleInputChange}
                placeholder="Tony Stark"
              />
            </StyledLabel>
            <StyledLabel>
              <StyledPLabel>Email</StyledPLabel>
              <StyledInput
                name="email"
                value={this.state.email}
                type="email"
                onChange={this.handleInputChange}
                placeholder="tonystark@example.com"
              />
            </StyledLabel>
            <StyledLabel>
              <StyledPLabel>Password</StyledPLabel>
              <StyledInput
                name="password"
                value={this.state.password}
                type="password"
                onChange={this.handleInputChange}
                placeholder="········"
              />
            </StyledLabel>

            <StyledLowerSignIn>
              <StyledLink to="/login"> Already have an account? </StyledLink>
              <StyledButton disabled={isInvalid} onClick={this.createAndLogInNewUser}>
                Register
              </StyledButton>
            </StyledLowerSignIn>
          </StyledForm>
          {this.state.error && (
            <Message warning attached="bottom">
              <Icon name="warning" />
              {this.state.error.message}
            </Message>
          )}
          <Button
            color="google plus"
            onClick={() => {
              this.props.firebase
                .login({ provider: 'google', type: 'popup' })
                .then(res => {
                  this.saveUserToDatabaseAndToLocalStorageWhenUsingGoogleSignIn(res);
                })
                .catch(error => {
                  console.log(error);
                });
            }}>
            <Icon name="google plus" /> Sign in with Google
          </Button>
        </StyledLoginCon>
        <LoginAnimation />
      </StyledLogin>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearFirestore: () => dispatch({ type: '@@reduxFirestore/CLEAR_DATA' })
  };
};

export default compose(
  withFirestore,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firebaseConnect()
)(Register);
