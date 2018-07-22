import axios from 'axios';
import {
  createAction,
  createActions,
  handleActions,
  combineActions
} from 'redux-actions';
import { combineReducers } from 'redux';
import dotProp from 'dot-prop-immutable';
import FirebaseActions from '../core/FirebaseAction';
import reduceReducers from 'reduce-reducers';

//=================
// Action Creators
//=================

const {
  imgUploadFulfill,
  imgUploadPending,
  imgUploadReject,
  imgUploadCancel
} = createActions(
  {
    IMG_UPLOAD_FULFILL: (url, type, no, historyId) => ({
      url,
      type,
      no,
      historyId
    }),
    IMG_UPLOAD_PENDING: (type, no, historyId) => ({
      type,
      no,
      historyId
    })
  },
  'IMG_UPLOAD_REJECT',
  'IMG_UPLOAD_CANCEL'
);

export function imgUpload(e, type = 'recipe', no = 0, historyId) {
  return dispatch => {
    dispatch(imgUploadPending(type, no, historyId));
    const files = e.target.files;
    const dataMaxSize = e.target.attributes.getNamedItem('data-max-size').value;

    if (files.length) {
      const file = files[0];
      if (file.size > dataMaxSize * 1024) {
        console.log('Please select a smaller file');
        return false;
      }
      const apiUrl = 'https://api.imgur.com/3/image';
      const formData = new FormData();
      formData.append('image', file);

      axios
        .post(apiUrl, formData, {
          headers: {
            Authorization: 'Bearer 260fc95d35018764d37bf918a786974790e9dcbb'
          }
        })
        .then(response => {
          const imgURL = response.data.data.link;
          dispatch(imgUploadFulfill(imgURL, type, no, historyId));
        })
        .catch(error => {
          dispatch(imgUploadReject());
        });
    } else {
      dispatch(imgUploadCancel());
    }
  };
}

export const {
  ingredientAdd,
  ingredientChange,
  ingredientDelete
} = createActions(
  {
    INGREDIENT_CHANGE: (order, changedText) => ({ order, changedText })
  },
  'INGREDIENT_ADD',
  'INGREDIENT_DELETE'
);

export const nameChange = createAction('NAME_CHANGE');

export const { stepAdd, stepChange, stepDelete } = createActions(
  {
    STEP_CHANGE: (order, changedText) => ({ order, changedText })
  },
  'STEP_ADD',
  'STEP_DELETE'
);

const {
  recipeFetchPending,
  recipeFetchFulfill,
  recipeFetchFulfillNewrecipe,
  recipeFetctReject
} = createActions(
  {
    RECIPE_FETCH_FULFILL: (recipe, recipeId) => ({ recipe, recipeId })
  },
  'RECIPE_FETCH_PENDING',
  'RECIPE_FETCH_REJECT',
  'RECIPE_FETCH_FULFILL_NEWRECIPE'
);

export function recipeFetch(recipeId) {
  return dispatch => {
    dispatch(recipeFetchPending());

    return FirebaseActions.getOnce(
      recipeId,
      snapshot => {
        let recipe = snapshot.val();
        if (recipe) {
          dispatch(recipeFetchFulfill(recipe, recipeId));
        } else {
          // get last id
          let lastId = 0;
          FirebaseActions.getOnce('', snapshot => {
            snapshot.forEach(function(childSnapshot) {
              let key = childSnapshot.key;
              if (parseInt(key, 10) > parseInt(lastId, 10)) {
                lastId = key;
              }
            });
            // console.log(`lastId: ${lastId}`);
            // set recipeId
            const newRecipeId = parseInt(lastId, 10) + 1;
            dispatch(recipeFetchFulfillNewrecipe(newRecipeId));
          });
        }
      },
      err => {
        dispatch(recipeFetctReject(err));
      }
    );
  };
}

const {
  recipeUpdatePending,
  recipeUpdateFulfill,
  recipeUpdateReject
} = createActions(
  {
    RECIPE_UPDATE_REJECT: error => ({ error })
  },
  'RECIPE_UPDATE_PENDING',
  'RECIPE_UPDATE_FULFILL'
);

export function recipeUpdate(recipeId, name, ingredients, steps, imgURL = '') {
  return dispatch => {
    dispatch(recipeUpdatePending());
    FirebaseActions.update(
      recipeId,
      {
        name: name,
        ingredients: ingredients,
        steps: steps,
        imgURL: imgURL
      },
      () => {
        dispatch(recipeUpdateFulfill());
      },
      err => {
        dispatch(recipeUpdateReject(err));
      }
    );
  };
}

export const reset = createAction('RESET');

//=================
// Default State
//=================

const defaultState = {
  data: {
    recipeId: 0,
    name: '',
    ingredients: [],
    steps: [],
    imgURL: ''
  },
  meta: {
    fetching: false,
    fetched: false,
    updating: false,
    updated: false,
    uploading: false,
    error: ''
  }
};

//=================
// Handler
//=================

const stepHandlers = {
  [stepChange]: (state, action) => {
    const changedText = action.payload.changedText;
    const order = action.payload.order;
    return dotProp.set(state, `steps.${order}.desp`, changedText);
  },
  [stepAdd]: (state, action) => {
    return dotProp.set(state, 'steps', [...state.steps, { desp: '' }]);
  },
  [stepDelete]: (state, action) => {
    const targetIndex = action.payload;
    return dotProp.delete(state, `steps.${targetIndex}`);
  }
};

const ingredientChangeHandlers = {
  [ingredientChange]: (state, action) => {
    const changedText = action.payload.changedText;
    const order = action.payload.order;
    return dotProp.set(state, `ingredients.${order}.name`, changedText);
  },
  [ingredientAdd]: (state, action) => {
    return dotProp.set(state, 'ingredients', [
      ...state.ingredients,
      { name: '' }
    ]);
  },
  [ingredientDelete]: (state, action) => {
    const targetIndex = action.payload;
    return dotProp.delete(state, `ingredients.${targetIndex}`);
  }
};

//=========
// Reducer
//=========

const dataReducer = handleActions(
  {
    [nameChange]: (state, action) => dotProp.set(state, 'name', action.payload),
    ...stepHandlers,
    ...ingredientChangeHandlers,
    [recipeFetchFulfillNewrecipe]: (state, action) => {
      const recipeId = action.payload;
      return {
        ...defaultState.data,
        recipeId: recipeId
      };
    },
    [recipeFetchFulfill]: (state, action) => {
      const recipe = action.payload.recipe;
      const recipeId = action.payload.recipeId;
      return {
        ...state,
        imgURL: recipe.imgURL,
        ingredients: recipe.ingredients,
        name: recipe.name,
        recipeId: recipeId,
        steps: recipe.steps,
        histories: recipe.histories
      };
    },
    [imgUploadFulfill]: (state, action) => {
      const { url: imgURL } = action.payload;
      return dotProp.set(state, 'imgURL', imgURL);
    }
  },
  defaultState.data
);

const metaReducer = handleActions(
  {
    [recipeFetchPending]: state => dotProp.set(state, 'fetching', true),
    [recipeUpdatePending]: (state, action) =>
      dotProp.set(state, 'updating', true),
    [recipeUpdateFulfill]: (state, action) => ({
      ...state,
      updating: false,
      updated: true
    }),
    [recipeUpdateReject]: (state, action) => {
      const error = action.payload;
      return {
        ...state,
        error: error,
        fetching: false
      };
    },
    [reset]: (state, action) => {
      return dotProp.set(state, 'updated', false);
    },
    [combineActions(recipeFetchFulfillNewrecipe, recipeFetchFulfill)]: (
      state,
      action
    ) => {
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
    },
    [imgUploadPending]: (state, action) => {
      return dotProp.set(state, 'uploading', true);
    },
    [imgUploadFulfill]: (state, action) => {
      return dotProp.set(state, 'uploading', false);
    },
    [combineActions(imgUploadReject, imgUploadCancel)](state, action) {
      return dotProp.set(state, 'uploading', false);
    }
  },
  defaultState.meta
);

const crossSliceReducer = handleActions({}, defaultState);

const recipeRedcuer = combineReducers({
  data: dataReducer,
  meta: metaReducer
});

const reducer = reduceReducers(crossSliceReducer, recipeRedcuer);

export default reducer;
