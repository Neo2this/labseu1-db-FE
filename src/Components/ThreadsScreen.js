import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firestoreConnect, withFirestore } from 'react-redux-firebase';

//Import components
import BackToButton from './reusable-components/BackToButton';
import ScreenHeading from './reusable-components/ScreenHeading';
import ThreadInformationCard from './reusable-components/ThreadInformationCard';
import CommentCard from './reusable-components/CommentCardComponents/CommentCard';
import NewCommentCard from './reusable-components/CommentCardComponents/NewCommentCard';

//Import actions
import { resetThread } from '../redux/actions/actionCreators';

//Main component
export class ThreadsScreen extends React.Component {
  componentDidMount() {
    let threadRef = this.props.firestore.collection('threads').doc(this.props.threadId);
    let whenUserHasSeen = {};
    whenUserHasSeen[`whenUserHasSeen.${localStorage.getItem('uuid')}`] = Date.now();
    threadRef.update(whenUserHasSeen);
  }

  componentWillUnmount() {
    let threadRef = this.props.firestore.collection('threads').doc(this.props.threadId);
    let whenUserHasSeen = {};
    whenUserHasSeen[`whenUserHasSeen.${localStorage.getItem('uuid')}`] = Date.now();
    threadRef.update(whenUserHasSeen);
  }
  render() {
    return (
      <StyledThreadContent>
        <BackToButton onClick={this.props.resetThread} />
        {this.props.activeThread && this.props.activeThread.threadName && (
          <StyledHeadingContainer>
            <ScreenHeading heading={this.props.activeThread.threadName} />
          </StyledHeadingContainer>
        )}
        {this.props.activeThread && this.props.activeThread.threadName && (
          <ThreadInformationCard
            img="http://lorempixel.com/480/480"
            createdBy={this.props.activeThread.threadCreatedByUserName}
            createdAt={this.props.activeThread.threadCreatedAt}
            spaceId={this.props.activeThread.spaceId}
            info={this.props.activeThread.threadTopic}
          />
        )}
        {this.props.comments.length > 0 &&
          this.props.comments.map(c => {
            return (
              <CommentCard
                key={c.id}
                img="http://lorempixel.com/480/480"
                commentId={c.id}
                createdBy={c.commentCreatedByUserName}
                createdByUserId={c.commentCreatedByUserId}
                content={c.commentBody}
                likes={c.arrayOfUserIdsWhoLiked.length}
                arrayOfUsersWhoLiked={c.arrayOfUserIdsWhoLiked}
                isCommentDecided={c.isCommentDecided}
                isCommentUpdated={c.isCommentUpdated}
                commentUpdatedAt={c.commentUpdatedAt}
                gifUrl={c.gifUrl}
              />
            );
          })}

        <NewCommentCard
          img="http://lorempixel.com/480/480"
          createdByUserId={localStorage.getItem('uuid')}
          thread={this.props.activeThread}
        />
      </StyledThreadContent>
    );
  }
}

const StyledThreadContent = styled.div`
  width: 100%;
  padding: 10vh 5%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
`;

const StyledHeadingContainer = styled.div`
  margin: 40px 0 30px 0;
  line-height: 1.3;
`;

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    activeThread: state.firestore.ordered.threads ? state.firestore.ordered.threads[0] : [],
    comments: state.firestore.ordered.comments ? state.firestore.ordered.comments : []
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ resetThread }, dispatch);
};

export default compose(
  withFirestore,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    return [
      {
        collection: 'threads',
        doc: props.threadId
      },
      {
        collection: 'comments',
        where: [['threadId', '==', props.threadId]],
        orderBy: ['commentCreatedAt', 'asc']
      }
    ];
  })
)(ThreadsScreen);
