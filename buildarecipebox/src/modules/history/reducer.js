import { createAction, handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import FirebaseActions from '../core/FirebaseAction';
import dotProp from 'dot-prop-immutable';

//===========
// Constants
//===========

export const PREFIX = 'history';

//=================
// Default State
//=================

const defaultState = {
  data: {
    recipeId: 0,
    name: '',
    imgURL: ''
  },
  meta: {
    fetching: false,
    fetched: false
  }
};

//=========
// Action
//=========

const recipeFetchPending = createAction(`${PREFIX}/RECIPE_FETCH_PENDING`);
const recipeFetchFulfill = createAction(
  `${PREFIX}/RECIPE_FETCH_FULFILL`,
  (recipe, recipeId) => ({
    recipe,
    recipeId
  })
);
const recipeFetctReject = createAction(`${PREFIX}/RECIPE_FETCH_REJECT`);

export function recipeFetch(recipeId) {
  return dispatch => {
    dispatch(recipeFetchPending());
    FirebaseActions.getOnce(
      recipeId,
      snapshot => {
        let recipe = snapshot.val();
        if (recipe) {
          dispatch(recipeFetchFulfill(recipe, recipeId));
        } else {
          dispatch(recipeFetctReject('recipe not exist'));
        }
      },
      err => {
        dispatch(recipeFetctReject(err));
      }
    );
  };
}

//=========
// Reducer
//=========

const dataReducer = handleActions(
  {
    [recipeFetchFulfill]: (state, action) => {
      const recipe = action.payload.recipe;
      const recipeId = action.payload.recipeId;
      return {
        ...state,
        name: recipe.name,
        recipeId: recipeId,
        histories: recipe.histories
      };
    }
  },
  defaultState.data
);

const metaReducer = handleActions(
  {
    [recipeFetchPending]: state => dotProp.set(state, 'fetching', true),
    [recipeFetchFulfill]: (state, action) => {
      return {
        ...state,
        fetching: false,
        fetched: true
      };
    },
    [recipeFetctReject]: (state, action) => {
      const error = action.payload;
      return {
        ...state,
        fetching: false,
        error: error
      };
    }
  },
  defaultState.meta
);

const recipeRedcuer = combineReducers({
  data: dataReducer,
  meta: metaReducer
});

const reducer = recipeRedcuer;

export default reducer;
