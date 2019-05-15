import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';

//Import actions
import { showModal } from '../redux/actions/actionCreators';

//Import semantic components
import { Icon, Dropdown } from 'semantic-ui-react';
import { setActiveOrg, switchSpaces, resetSpace } from '../redux/actions/actionCreators';

import Spinner from './semantic-components/Spinner';

//Import icons
import plusIcon from '../images/icon-plus-lightgray.svg';
import homeIcon from '../images/icon-home-lightgray.svg';
import { NavBarOrgDropdown } from './NavBarOrgDropdown';

export class NavBar extends Component {
  state = {
    profileDropdown: ''
  };

  handleLogOut = async () => {
    await this.props.firebase.logout();
    this.props.clearFirestore();
    localStorage.clear();
  };

  handleDropDownChange = (e, { name, value }) => {
    this.setState({ [name]: value }, () => {
      if (this.state.profileDropdown === 'Log out') {
        this.handleLogOut();
      }
      if (this.state.profileDropdown === 'Profile') {
        this.props.showModal('Profile');
      }
    });
  };

  setSelectedOrgToLocalStorage = (e, data) => {
    e.preventDefault();
    const { value } = data;
    localStorage.setItem('activeOrg', value);
    this.props.resetSpace();
  };

  generateDropdownOptions = () => {};
  render() {
    if (this.props.user.id === this.props.uuid) {
      const { spacesForActiveOrg, orgsFromArrayOfUsersIds } = this.props;
      // const allOrgsForUser = [...orgsFromArrayOfUsersIds, ...orgsFromArrayOfAdminsIds];
      const orgOptions = orgsFromArrayOfUsersIds.map(org => ({
        key: org.orgName,
        text: org.orgName,
        value: `${org.id}`
      }));
      // const isOrgsLoaded = orgsFromArrayOfUsersIds.length > 0;
      const userOptions = [
        {
          key: this.props.user.fullName,
          text: this.props.user.fullName,
          value: this.props.user.fullName
        },
        {
          key: 'Profile',
          text: 'Profile',
          value: 'Profile'
        },
        {
          key: 'Create Organisation',
          text: 'Create Organisation',
          value: 'Create Organisation'
        },
        {
          key: 'Log out',
          text: 'Log out',
          value: 'Log out'
        }
      ];
      if (this.state.profileDropdown === 'Create Organisation') {
        return <Redirect to="/createneworganisation" />;
      }
      return (
        <NavBarContainer>
          <HeaderContainer>
            <InnerContainerHorizontal>
              {this.props.user.profileUrl && <StyledImage src={this.props.user.profileUrl} alt="user" />}
              {orgOptions && (
                //this.props.user.fullName
                <div>
                  {' '}
                  <Dropdown
                    inline
                    name={'profileDropdown'}
                    basic={true}
                    options={userOptions}
                    defaultValue={this.props.user.fullName}
                    // defaultValue={'hello'}
                    onChange={this.handleDropDownChange}
                  />
                </div>
              )}
            </InnerContainerHorizontal>
            <div>
              <Icon name="cog" />
            </div>
          </HeaderContainer>
          <InnerContainer>
            <HomeContainer>
              <img src={homeIcon} alt="home icon" />
              <span onClick={this.props.resetSpace}>Home</span>
            </HomeContainer>

            <div>
              <div>
                <OuterOrgContainer>
                  <OrgContainer>
                    <Icon name="building outline" size="large" />
                    {this.props.activeOrg && (
                      <NavBarOrgDropdown
                        // setActiveOrg={this.props.setActiveOrg}
                        activeOrg={this.props.activeOrg}
                        orgOptions={orgOptions}
                        setSelectedOrgToLocalStorage={this.setSelectedOrgToLocalStorage}
                      />
                      //********************************************** */
                    )}
                  </OrgContainer>
                  <div>
                    <img src={plusIcon} alt="plus icon" />
                  </div>
                </OuterOrgContainer>
                <SpaceContainer>
                  {spacesForActiveOrg && (
                    <div>
                      {spacesForActiveOrg.map((space, index) => (
                        <div key={index}>
                          <span
                            onClick={event => {
                              event.preventDefault();
                              this.props.switchSpaces(space.id);
                            }}>
                            {space.spaceName}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </SpaceContainer>
              </div>
            </div>
          </InnerContainer>
        </NavBarContainer>
      );
    } else {
      return <Spinner />;
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.firestore.ordered.filteredUser ? state.firestore.ordered.filteredUser[0] : '',
    orgsFromArrayOfUsersIds: state.firestore.ordered.orgsInWhichUser ? state.firestore.ordered.orgsInWhichUser : [],
    // orgsFromArrayOfAdminsIds: state.firestore.ordered.orgsInWhichAdmin ? state.firestore.ordered.orgsInWhichAdmin : [],
    spacesForActiveOrg: state.firestore.ordered.filteredSpaces ? state.firestore.ordered.filteredSpaces : [],
    uuid: localStorage.getItem('uuid') ? localStorage.getItem('uuid') : '',
    activeOrg: localStorage.getItem('activeOrg') ? localStorage.getItem('activeOrg') : '',
    // fullName: localStorage.getItem('fullName') ? localStorage.getItem('fullName') : '',
    activeModal: state.modal.activeModal
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      clearFirestore: () => dispatch({ type: '@@reduxFirestore/CLEAR_DATA' }),
      setActiveOrg,
      switchSpaces,
      resetSpace,
      showModal
    },
    dispatch
  );
};

//Connect to Firestore
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => {
    // if (!userDoc) return []; <-- empty array if no userDoc in local storage
    return [
      {
        collection: 'users',
        doc: `${props.uuid}`,
        storeAs: 'filteredUser'
      },
      {
        collection: 'spaces',
        where: [['arrayOfUserIdsInSpace', '==', props.uuid], ['orgId', '==', props.activeOrg]],
        storeAs: 'filteredSpaces'
      },
      {
        collection: 'organisations',
        where: ['arrayOfUsersIds', '==', props.uuid],
        storeAs: 'orgsInWhichUser'
      }
      // {
      //   collection: 'organisations',
      //   where: ['arrayOfAdminsIds', '==', props.uuid],
      //   storeAs: 'orgsInWhichAdmin'
      // }
    ];
  })
)(NavBar);

const HeaderContainer = styled.div`
  padding-left: 32px;
  padding-right: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  div:nth-child(2) {
    &:hover {
      cursor: pointer;
    }
  }
`;

const InnerContainerHorizontal = styled.div`
  display: flex;
  align-items: center;
  div {
    margin-right: 8px;
  }
  &:hover {
    cursor: pointer;
    font-weight: 600;
    box-shadow: 3px 3px 13px -10px #000;
    border-radius: 16px;
    .chevron {
      color: #f64e49;
    }
  }
  div {
    color: rgb(55, 71, 80);
  }
`;

const InnerContainer = styled.div`
  padding-top: 40px;
  padding-left: 32px;
  padding-bottom: 16px;
`;

const HomeContainer = styled.div`
  padding-left: 4px;
  position: relative;
  display: flex;
  align-items: baseline;
  img {
    width: 1.25rem;
    /* margin-right: 7px;
    margin-left: 4px; */
    position: absolute;
    right: 249px;
    bottom: 4px;
    &:hover {
      cursor: pointer;
    }
  }
  span {
    padding-left: 41px;
  }
  span:hover {
    color: #f64e49;
    cursor: pointer;
  }
`;

const OrgContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 8px;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  align-items: baseline;
  color: rgb(55, 71, 80);
  font-size: 14px;
  font-weight: 600;
  span {
    padding-right: 8px;
    padding-left: 12px;
  }
  &:hover {
    cursor: pointer;
    border-radius: 16px;
    box-shadow: 3px 3px 13px -10px #000;
    .chevron {
      color: #f64e49;
    }
  }
`;

const OuterOrgContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  div:nth-child(2) {
    display: flex;
    align-items: flex-end;
  }
  img {
    width: 1.25rem;
    margin-right: 8px;
    margin-right: 20px;
    &:hover {
      cursor: pointer;
    }
  }
`;

const SpaceContainer = styled.div`
  margin-left: 8px;
  line-height: 30px;
  span {
    margin-left: 40px;
    &:hover {
      color: #f64e49;
      cursor: pointer;
    }
  }
`;

const NavBarContainer = styled.div`
  height: 100vh;
  width: 309px;
  padding-top: 32px;
  font-family: 'Open Sans', Helvetica, Arial, 'sans-serif';
  color: #9c9c9c;
  font-size: 13px;
`;

const StyledImage = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  margin-right: 8px;
`;
