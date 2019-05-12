import * as types from '../actions/actionTypes';

export function modal(state = { activeModal: null }, action) {
  switch (action.type) {
    case types.RENDER_MODAL:
      return { ...state, activeModal: action.payload };
    default:
      return state;
  }
}

export function spaceId(state = '', action) {
  switch (action.type) {
    case types.SHOW_SPACES_THREADS:
      return action.payload;
    case types.RESET_SPACE:
      return '';
    default:
      return state;
  }
}
