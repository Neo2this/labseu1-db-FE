import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import * as reducers from './appReducers';
export const initialState = {};

//When we have local reducers, we nbeed to add them here
export const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  modal: reducers.modal,
  activeOrg: reducers.activeOrg,
  spaceId: reducers.spaceId,
  threadId: reducers.threadId,
  upgradeScreen: reducers.upgradeScreen,
  followUpStatus: reducers.followUpStatus,
  profileRenderStatus: reducers.profileRenderStatus,
  editingProfileStatus: reducers.editingProfileStatus,
  resetPassword: reducers.resetPassword
});
