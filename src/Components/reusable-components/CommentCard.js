import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, withFirestore } from 'react-redux-firebase';

//Import icons
import heartIconBlack from '../../images/icon-heart-black.svg';
import heartIconRed from '../../images/icon-heart-red.svg';

//Semantic components
import { Dropdown } from 'semantic-ui-react';

//Import components
import UpdateComment from '../reusable-components/UpdateComment';

//Main component
export class CommentCard extends React.Component {
  state = {
    didUserLikeComment: this.props.arrayOfUsersWhoLiked.includes(localStorage.getItem('uuid')),
    isUpdating: false,
    isHovering: false,
    text: this.props.content
  };

  toggleLikePhoto = () => {
    this.setState(prevState => ({
      didUserLikeComment: !prevState.didUserLikeComment
    }));
  };

  deleteComment = id => {
    this.props.firestore
      .collection('comments')
      .doc(id)
      .delete();
  };

  setIsUpdating = boolean => {
    this.setState({
      isUpdating: boolean
    });
  };

  setIsHovering = boolean => {
    this.setState({
      isHovering: boolean
    });
  };

  setIsCommentUpdated = boolean => {
    this.setState({
      isCommentUpdated: boolean
    });
  };

  dateInfo = new Date(this.props.commentUpdatedAt);
  date = `${this.dateInfo.getMonth()}/${this.dateInfo.getDate()} ${this.dateInfo.getHours()}:${this.dateInfo.getMinutes()}`;

  render() {
    const {
      img,
      createdBy,
      content,
      commentId,
      likes,
      createdByUserId,
      commentUpdatedAt,
      isCommentUpdated
    } = this.props;
    return (
      <StyledCommentContainer
        onMouseEnter={() => this.setIsHovering(true)}
        onMouseLeave={() => this.setIsHovering(false)}>
        {this.state.isHovering && (
          <Dropdown>
            <Dropdown.Menu>
              <Dropdown.Item text="Mark as Decision" />
              {localStorage.getItem('uuid') === createdByUserId && (
                <Dropdown.Item text="Edit Comment" onClick={() => this.setIsUpdating(true)} />
              )}
              {localStorage.getItem('uuid') === createdByUserId && (
                <Dropdown.Item text="Delete Comment" onClick={() => this.deleteComment(commentId)} />
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}
        {this.state.isUpdating && (
          <UpdateComment
            commentId={commentId}
            content={content}
            setIsUpdating={this.setIsUpdating}
            setIsCommentUpdated={this.setIsCommentUpdated}
          />
        )}
        {!this.state.isUpdating && (
          <StyledImageContainer>
            <img src={img} alt="author" />
            {/* <div className="initials">{createdBy[0]}</div> */}
          </StyledImageContainer>
        )}
        {!this.state.isUpdating && (
          <StyledRightContainer>
            <StyledAuthorsName>{createdBy}</StyledAuthorsName>
            <StyledContent>{content}</StyledContent>
            {isCommentUpdated && this.state.isHovering && (
              <StyledUpdatedMessage>Updated at {this.date}</StyledUpdatedMessage>
            )}
            <StyledLikesContainer>
              {!this.state.didUserLikeComment && (
                <img
                  src={heartIconBlack}
                  alt="heart icon"
                  onClick={() => {
                    this.toggleLikePhoto();
                    let commentRef = this.props.firestore.collection('comments').doc(commentId);
                    commentRef.update({
                      arrayOfUserIdsWhoLiked: this.props.firestore.FieldValue.arrayUnion(localStorage.getItem('uuid'))
                    });
                  }}
                />
              )}
              {!this.state.didUserLikeComment && likes !== 0 && <div className="black-likes">{likes}</div>}
              {this.state.didUserLikeComment && (
                <img
                  src={heartIconRed}
                  alt="heart icon"
                  onClick={() => {
                    this.toggleLikePhoto();
                    let commentRef = this.props.firestore.collection('comments').doc(commentId);
                    commentRef.update({
                      arrayOfUserIdsWhoLiked: this.props.firestore.FieldValue.arrayRemove(localStorage.getItem('uuid'))
                    });
                  }}
                />
              )}
              {this.state.didUserLikeComment && <div className="red-likes">{likes}</div>}
            </StyledLikesContainer>
          </StyledRightContainer>
        )}
      </StyledCommentContainer>
    );
  }
}

//Styling
const StyledCommentContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: flex-start;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 12px 0px;
  background-color: white;
  padding: 20px;
  width: 100%;
  margin-top: 30px;
  .ui.dropdown {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;
const StyledImageContainer = styled.div`
  width: 35px;
  height: 35px;
  img {
    border-radius: 50%;
    max-height: 100%;
  }
  .initials {
    border-radius: 50%;
    background-color: #5c4df2;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
  }
`;
const StyledRightContainer = styled.div`
  padding-left: 30px;
`;
const StyledAuthorsName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2;
  padding-bottom: 10px;
`;
const StyledContent = styled.div`
  line-height: 1.75;
  font-weight: 300;
`;
const StyledLikesContainer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  img {
    height: 1.8rem;
    margin-right: 5px;
    cursor: pointer;
  }
  .black-likes {
    color: black;
    font-weight: 600;
  }
  .red-likes {
    color: #f64e49;
    font-weight: 600;
  }
`;

const StyledUpdatedMessage = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #bdc3c9;
  font-size: 0.8rem;
`;

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = {};

export default compose(
  withFirestore,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect()
)(CommentCard);
