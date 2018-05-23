import { combineReducers } from 'redux';
import recipe from './recipeReducer';
import { createAction, handleActions, combineActions } from 'redux-actions';

export const NAME_CHANGE = createAction('NAME_CHANGE');

const reducer = handleActions(
  {
    NAME_CHANGE: (state, action) => ({
      ...state,
      name: action.payload
    })
  },
  { name: '' }
);

export default combineReducers({
  recipe,
  reducer
});
