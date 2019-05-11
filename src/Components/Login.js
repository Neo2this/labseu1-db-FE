import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect, isLoaded, isEmpty, withFirestore } from 'react-redux-firebase';
import { Button, Icon, Message } from 'semantic-ui-react';

import { StyledButton, ForgotPasswordDiv } from './styled-components/StyledButton';
import {
  StyledLogin,
  StyledForm,
  StyledInput,
  StyledLabel,
  StyledLoginCon,
  StyledLowerSignIn,
  StyledIcon
} from './styled-components/StyledLogin';
import { StyledH1, StyledLink, StyledPLabel } from './styled-components/StyledText';
import Spinner from './semantic-components/Spinner';
import LoginAnimation from './animations/LoginAnimation';
import { PasswordlessButton } from './styled-components/StyledButton';
import showPassword from '../images/showPassword.svg';
import { setActiveOrg } from '../redux/actions/actionCreators';

class Login extends Component {
  static propTypes = {
    auth: PropTypes.object,
    firebase: PropTypes.shape({
      login: PropTypes.func.isRequired,
      logout: PropTypes.func.isRequired
    })
  };

  state = {
    loginEmail: '',
    loginPassword: '',
    error: null
  };

  componentWillUpdate() {
    if (!isEmpty(this.props.auth)) {
      this.props.history.push('/homescreen');
    }
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogIn = e => {
    const INITIAL_STATE = {
      loginEmail: '',
      loginPassword: '',
      error: null
    };
    e.preventDefault();
    this.props.firebase
      .login({
        email: this.state.loginEmail,
        password: this.state.loginPassword
      })
      .then(res => {
        this.setUserIdInLocalStorage(res.user.user.email, this.props.setActiveOrg);
      })
      .catch(error => {
        this.setState({ ...INITIAL_STATE, error });
      });
  };

  setUserIdInLocalStorage = (email, setActiveOrg) => {
    var ref = this.props.firestore.collection('users').where('userEmail', '==', email);

    ref
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          localStorage.setItem('uuid', doc.id);
          localStorage.setItem('userData', JSON.stringify(doc.data()));
          // to parse use -> var user = JSON.parse(localStorage.getItem('userData'))
          setActiveOrg(doc.data().arrayOfOrgsIds[0]);
        });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  togglePassword = () => {
    let temp = document.getElementById('typepass');
    if (temp.type === 'password') {
      temp.type = 'text';
    } else {
      temp.type = 'password';
    }
  };

  render() {
    const { loginEmail, loginPassword } = this.state;
    const isInvalid = loginPassword === '' || loginEmail === '';

    if (!isLoaded(this.props.auth)) {
      return <Spinner />;
    }
    if (!isEmpty(this.props.auth)) {
      return null;
    }
    return (
      <StyledLogin>
        <StyledLoginCon>
          <StyledH1>Sign in</StyledH1>
          <StyledForm onSubmit={this.handleLogIn}>
            <StyledLabel>
              <StyledPLabel>Email Address</StyledPLabel>
              <StyledInput
                name="loginEmail"
                value={this.state.loginEmail}
                type="email"
                onChange={this.handleInputChange}
                placeholder="tonystark@example.com"
              />
            </StyledLabel>
            <StyledLabel>
              <StyledPLabel>Password</StyledPLabel>
              <StyledInput
                id="typepass"
                name="loginPassword"
                value={this.state.loginPassword}
                type="password"
                onChange={this.handleInputChange}
                placeholder="········"
              />
              <StyledIcon src={showPassword} alt="showPassword" onClick={this.togglePassword} />
            </StyledLabel>
            <ForgotPasswordDiv onClick={() => this.props.history.push('/forgotPassword')}>
              Forgot Password?
            </ForgotPasswordDiv>
            <StyledLowerSignIn>
              <StyledLink to="/register"> Don't have an account? </StyledLink>
              <StyledButton disabled={isInvalid} onClick={this.handleLogIn}>
                Sign In &#62;
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
            onClick={() =>
              this.props.firebase.login({
                provider: 'google',
                type: 'popup'
              })
            }
          >
            <Icon name="google plus" /> Sign in with Google
          </Button>
          <PasswordlessButton onClick={() => this.props.history.push('/passwordlesssubmit')}>
            Email Me a Link to Sign In
          </PasswordlessButton>
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
  return bindActionCreators(
    {
      clearFirestore: () => dispatch({ type: '@@reduxFirestore/CLEAR_DATA' }),
      setActiveOrg
    },
    dispatch
  );
};

export default compose(
  withFirestore,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firebaseConnect()
)(Login);
