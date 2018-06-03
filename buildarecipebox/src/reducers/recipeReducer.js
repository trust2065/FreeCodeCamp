import _ from 'lodash';
import {
  createAction,
  createActions,
  handleActions,
  combineActions
} from 'redux-actions';
import database from '../components/Firebase';
import RecipeDao from '../components/RecipeDao';
import axios from 'axios';

export const imgUploaderAdd = createAction(
  'IMGUPLOADER_ADD',
  (type, historyId) => ({ type, historyId })
);

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
    })
  },
  'IMG_UPLOAD_PENDING',
  'IMG_UPLOAD_REJECT',
  'IMG_UPLOAD_CANCEL'
);

export function imgUpload(e, type = 'recipe', no = 0, historyId) {
  return dispatch => {
    dispatch(imgUploadPending());
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

export const {
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
    const recipeRef = database.ref(`recipe/${recipeId}`);

    return recipeRef.once('value').then(
      function(snapshot) {
        let recipe = snapshot.val();
        // console.log('recipe');
        // console.log(recipe);
        if (recipe) {
          dispatch(recipeFetchFulfill(recipe, recipeId));
        } else {
          // get last id
          let lastId = 0;
          RecipeDao.getList(snapshot => {
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
      function(err) {
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
  'RECIPE_UPDATE_PENDING',
  'RECIPE_UPDATE_FULFILL',
  'RECIPE_UPDATE_REJECT'
);

export function recipeUpdate(recipeId, name, ingredients, steps, imgURL = '') {
  return dispatch => {
    dispatch(recipeUpdatePending());
    database
      .ref('recipe/' + recipeId)
      .update({
        name: name,
        ingredients: ingredients,
        steps: steps,
        imgURL: imgURL
      })
      .then(() => {
        dispatch(recipeUpdateFulfill());
      })
      .catch(function(err) {
        dispatch(recipeUpdateReject());
      });
  };
}

export const reset = createAction('RESET');

export const {
  historyAdd,
  historyDateChange,
  historyRemarkChange
} = createActions(
  {
    HISTORY_DATE_CHANGE: (value, historyId) => ({ value, historyId }),
    HISTORY_REMARK_CHANGE: (value, historyId) => ({ value, historyId })
  },
  'HISTORY_ADD'
);

const {
  historyUpdatePending,
  historyUpdateFulfill,
  historyUpdateReject
} = createActions(
  'HISTORY_UPDATE_PENDING',
  'HISTORY_UPDATE_FULFILL',
  'HISTORY_UPDATE_REJECT'
);

export function historyUpdate(recipeId, histories) {
  return dispatch => {
    dispatch(historyUpdatePending());
    database
      .ref('recipe/' + recipeId)
      .update({
        histories: histories
      })
      .then(() => {
        dispatch(historyUpdateFulfill());
      })
      .catch(function(err) {
        dispatch(historyUpdateReject());
      });
  };
}

const defaultState = {
  recipeId: 0,
  name: '',
  ingredients: [],
  steps: [],
  fetching: false,
  fetched: false,
  updating: false,
  updated: false,
  uploading: false,
  imgURL: '',
  histories: [],
  historyId: 0
};

const reducer = handleActions(
  {
    NAME_CHANGE: (state, action) => ({
      ...state,
      name: action.payload
    }),
    RECIPE_FETCH_PENDING: (state, action) => ({
      ...state,
      name: action.payload
    }),
    RECIPE_FETCH_FULFILL_NEWRECIPE: (state, action) => ({
      ...defaultState,
      recipeId: action.payload
    }),
    RECIPE_FETCH_FULFILL: (state, action) => {
      const recipe = action.payload.recipe;
      const recipeId = action.payload.recipeId;

      return {
        ...state,
        fetching: false,
        fetched: true,
        imgURL: recipe.imgURL,
        ingredients: recipe.ingredients,
        name: recipe.name,
        recipeId: recipeId,
        steps: recipe.steps,
        histories: recipe.histories
      };
    },
    RECIPE_FETCH_REJECT: (state, action) => ({
      ...state,
      updating: false,
      error: action.payload
    }),
    RECIPE_UPDATE_PENDING: (state, action) => ({
      ...state,
      updating: true
    }),
    RECIPE_UPDATE_FULFILL: (state, action) => ({
      ...state,
      updating: false,
      updated: true
    }),
    RECIPE_UPDATE_REJECT: (state, action) => ({
      ...state,
      error: action.payload,
      fetching: false
    }),
    RESET: (state, action) => ({ ...state, updated: false }),
    STEP_CHANGE: (state, action) => {
      let steps = [...state.steps];
      steps[action.payload.order].desp = action.payload.changedText;
      return { ...state, steps: steps };
    },
    STEP_ADD: (state, action) => {
      let steps = [...state.steps];
      let newStep;
      if (steps.length === 0) {
        newStep = 1;
      } else {
        newStep = parseInt(steps[steps.length - 1].step + 1, 10);
      }
      steps.push({ desp: '', step: newStep });
      return { ...state, steps: steps };
    },
    STEP_DELETE: (state, action) => {
      const targetIndex = action.payload;
      let steps = [...state.steps];
      steps.splice(targetIndex, 1);
      steps = steps.map((step, i) => {
        if (i >= targetIndex) {
          step.step = step.step - 1;
        }
        return step;
      });
      return { ...state, steps: steps };
    },
    INGREDIENT_CHANGE: (state, action) => {
      let ingredients = [...state.ingredients];
      ingredients[action.payload.order].name = action.payload.changedText;
      return { ...state, ingredients: ingredients };
    },
    INGREDIENT_ADD: (state, action) => {
      let ingredients = [...state.ingredients];
      ingredients.push({ name: '' });
      return { ...state, ingredients: ingredients };
    },
    INGREDIENT_DELETE: (state, action) => {
      const targetIndex = action.payload;
      let ingredients = [...state.ingredients];
      ingredients.splice(targetIndex, 1);
      return { ...state, ingredients: ingredients };
    },
    IMGUPLOADER_ADD: (state, action) => {
      const { type } = action.payload;
      switch (type) {
        case 'History':
          const { historyId } = action.payload;
          const histories = [...state.histories];
          const index = _.findIndex(histories, ['id', historyId]);
          const history = histories[index];
          let images = history.images;
          let newNo;

          if (images.length === 0) {
            newNo = 1;
          } else {
            newNo = parseInt(images[images.length - 1].no + 1, 10);
          }
          images.push({ url: '', no: newNo });
          history.images = images;
          return { ...state, histories: histories };
        default:
          return state;
      }
    },
    IMG_UPLOAD_PENDING: (state, action) => ({ ...state, uploading: true }),
    IMG_UPLOAD_FULFILL: (state, action) => {
      const { type, no, url } = action.payload;

      if (type === 'History') {
        if (no) {
          const { historyId } = action.payload;
          const histories = [...state.histories];
          const index = _.findIndex(histories, ['id', historyId]);
          const history = histories[index];

          let images = history.images;

          images[no - 1].url = url;
          history.images = images;

          return {
            ...state,
            uploading: false,
            history: history
          };
        }
      }
      return {
        ...state,
        uploading: false,
        imgURL: url
      };
    },
    [combineActions(imgUploadReject, imgUploadCancel)](state, action) {
      return { ...state, uploading: false };
    },
    HISTORY_ADD: (state, action) => {
      let histories;
      let newHistoryId;

      if (!state.histories) {
        newHistoryId = 1;
        histories = [{ id: newHistoryId, images: [] }];
      } else {
        histories = [...state.histories];
        let lastId = 0;

        histories.forEach(history => {
          if (parseInt(history.id, 10) > lastId) {
            lastId = history.id;
          }
        });
        newHistoryId = lastId + 1;

        histories.push({ id: newHistoryId, images: [] });
      }
      return { ...state, historyId: newHistoryId, histories: histories };
    },
    HISTORY_REMARK_CHANGE: (state, action) => {
      const { value, historyId } = action.payload;
      const histories = [...state.histories];

      let history;
      const index =
        historyId !== 0 && _.findIndex(histories, ['id', historyId]);
      if (index !== -1) {
        history = histories[index];
      }

      if (history) {
        history.remark = value;
      }

      return { ...state, histories: histories };
    },
    HISTORY_DATE_CHANGE: (state, action) => {
      const { value, historyId } = action.payload;
      const histories = [...state.histories];

      let history;
      const index =
        historyId !== 0 && _.findIndex(histories, ['id', historyId]);
      if (index !== -1) {
        history = histories[index];
      }

      if (history) {
        history.date = value;
      }

      return { ...state, histories: histories };
    },
    HISTORY_UPDATE_PENDING: (state, action) => ({
      ...state,
      updating: true
    }),
    HISTORY_UPDATE_FULFILL: (state, action) => ({
      ...state,
      updating: false,
      updated: true
    }),
    HISTORY_UPDATE_REJECT: (state, action) => ({
      ...state,
      error: action.payload,
      fetching: false
    })
  },
  defaultState
);

export default reducer;
