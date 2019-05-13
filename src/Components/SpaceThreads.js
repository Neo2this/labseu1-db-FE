import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

import penIconWhite from '../images/icon-pen-white.svg';

import ScreenHeading from './reusable-components/ScreenHeading';
import ScreenSectionHeading from './reusable-components/ScreenSectionHeading';
import ScreenButton from './reusable-components/ScreenButton';
import ThreadCard from './reusable-components/ThreadCard';

function SpaceThreads(props) {
  return (
    <StyledMainScreen>
      <StyledFirstRow>
        <ScreenHeading heading={props.space.spaceName} info={`Read all the threads from ${props.space.spaceName}`} />
        <ScreenButton
          content="Start a thread"
          icon={penIconWhite}
          backgroundColor="#5C4DF2"
          color="white"
          border="none"
        />
      </StyledFirstRow>
      <ScreenSectionHeading heading="Recent" />

      {/* If not threads, show placeholder - IT RENDERS PLACEHOLDER FOR A SECOND WHEN RENDERING THREADS
      {/*WE NEED TO FIGURE OUT THE LOGIC, BUT FOR NOW IT IS GOING TO BE COMMENTED OUT*/}
      {/* {props.threads.length === 0 && (
        <Placeholder
          heading='Learn about Home'
          info='Home is a great place where you find all information about active threads and current discussion. Be allways on the top of the things!'
          image={placeholder}
        />
      )} */}

      {/*Loop trough all the threads that are associated with the orgId*/}
      {/*OrgId is hardcoded -> we will need to fix this when we get id from logged in user*/}
      {props.threads.length > 0 &&
        props.threads.map(t => {
          let dateInfo = new Date(t.threadCreatedAt.seconds * 1000);
          let date = `${dateInfo.getMonth()}/${dateInfo.getDate()} ${dateInfo.getHours()}:${dateInfo.getMinutes()}`;
          return (
            <ThreadCard
              key={t.id}
              createdBy={t.threadCreatedByUserName}
              createdAt={date}
              spaceId={t.spaceId}
              threadId={t.id}
              heading={t.threadName}
              info={t.threadTopic}
              checked="true"
            />
          );
        })}
    </StyledMainScreen>
  );
}

const StyledMainScreen = styled.div`
  background-color: #faf9f7;
  min-height: 100vh;
  padding: 10vh 5%;
`;

const StyledFirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5vh;
`;

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    threads: state.firestore.ordered.threads ? state.firestore.ordered.threads : [],
    space: state.firestore.ordered.spaces ? state.firestore.ordered.spaces[0] : [],
    spaceId: state.spaceId
  };
};

const mapDispatchToProps = {};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    return [
      {
        collection: 'threads',
        where: ['spaceId', '==', props.spaceId]
      },
      {
        collection: 'spaces',
        doc: props.spaceId
      }
    ];
  })
)(SpaceThreads);