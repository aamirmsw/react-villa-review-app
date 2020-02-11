// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { SAVE_VILLA_REVIEW } from './constants';

export function saveVillaReview(products) {
  return {
    type: SAVE_VILLA_REVIEW,
    data: products,
  };
}


export function reducer(state, action) {
  switch (action.type) {

    case SAVE_VILLA_REVIEW:
      return {
        ...state,
        villaReview: action.data,
      };

    default:
      return state;
  }
}
