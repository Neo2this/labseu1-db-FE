import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty, isLoaded, withFirestore } from 'react-redux-firebase';
import NavBar from './NavBar';
import styled from 'styled-components';

import Spinner from './semantic-components/Spinner';
import RightSidebar from './RightSidebar';
import MainScreen from './MainScreen';

class FakeHome extends Component {
  componentWillUpdate() {
    if (isEmpty(this.props.auth)) {
      this.props.history.push('/login');
    }
  }

  componentDidMount() {
	  if (!isEmpty(this.props.auth)) {
		console.log('hello');
		this.props.firestore.collection('users').where('userEmail', '==', this.props.auth.email).get()
		.then(data => {
			data.forEach(function(doc) {
      		// doc.data() is never undefined for query doc snapshots
      		console.log(doc);
    	});
		})
	}
  }


  render() {
    if (!isLoaded(this.props.auth)) {
      return <Spinner />;
    }
    return (
      <StyledHomeScreen>
        <FirstDiv>
          <NavBar />
        </FirstDiv>
        <MidRightContainer>
          <SecondDiv>
            <MainScreen />
          </SecondDiv>
          <ThirdDiv>
            <RightSidebar />
          </ThirdDiv>
        </MidRightContainer>
      </StyledHomeScreen>
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

const StyledHomeScreen = styled.div`
  display: flex;
`;
const FirstDiv = styled.div`
  width: 309px;
  border: 1px solid black;
`;

const SecondDiv = styled.div`
  width: 70%;
  border: 1px solid black;
`;

const ThirdDiv = styled.div`
  width: 30%;
  border: 1px solid black;
`;

const MidRightContainer = styled.div`
  border: 1px solid red;
  width: 100vw;
  display: flex;
`;

export default compose(
	withFirestore,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firebaseConnect()
)(FakeHome);
