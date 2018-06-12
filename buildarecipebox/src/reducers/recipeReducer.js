import _ from 'lodash';
import axios from 'axios';
import {
  createAction,
  createActions,
  handleActions,
  combineActions
} from 'redux-actions';
import database from '../components/Firebase';
import dotProp from 'dot-prop-immutable';
import moment from 'moment';
import RecipeDao from '../components/RecipeDao';

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

// export const historyIdSet = createAction('HISTORYID_SET');

export const {
  historyDateChange,
  historyRemarkChange,
  historyAdd,
  historyEdit
} = createActions(
  {
    HISTORY_DATE_CHANGE: (date, historyId) => ({ date, historyId }),
    HISTORY_REMARK_CHANGE: (remark, historyId) => ({ remark, historyId })
  },
  'HISTORY_ADD',
  'HISTORY_EDIT'
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
    NAME_CHANGE: (state, action) => dotProp.set(state, 'name', action.payload),
    RECIPE_FETCH_PENDING: state => dotProp.set(state, 'fetching', true),
    RECIPE_FETCH_FULFILL_NEWRECIPE: (state, action) => {
      const recipeId = action.payload;
      return dotProp.set(defaultState, 'recipeId', recipeId);
    },
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
    RECIPE_FETCH_REJECT: (state, action) => {
      const error = action.payload;
      return {
        ...state,
        fetching: false,
        error: error
      };
    },
    RECIPE_UPDATE_PENDING: (state, action) =>
      dotProp.set(state, 'updating', true),
    RECIPE_UPDATE_FULFILL: (state, action) => ({
      ...state,
      updating: false,
      updated: true
    }),
    RECIPE_UPDATE_REJECT: (state, action) => {
      const error = action.payload;
      return {
        ...state,
        error: error,
        fetching: false
      };
    },
    RESET: (state, action) => {
      return dotProp.set(state, 'updated', false);
    },
    STEP_CHANGE: (state, action) => {
      const changedText = action.payload.changedText;
      const order = action.payload.order;
      return dotProp.set(state, `steps.${order}.desp`, changedText);
    },
    STEP_ADD: (state, action) => {
      return dotProp.set(state, 'steps', [...state.steps, { desp: '' }]);
    },
    STEP_DELETE: (state, action) => {
      const targetIndex = action.payload;
      return dotProp.delete(state, `steps.${targetIndex}`);
    },
    INGREDIENT_CHANGE: (state, action) => {
      const changedText = action.payload.changedText;
      const order = action.payload.order;
      return dotProp.set(state, `ingredients.${order}.name`, changedText);
    },
    INGREDIENT_ADD: (state, action) => {
      return dotProp.set(state, 'ingredients', [
        ...state.ingredients,
        { name: '' }
      ]);
    },
    INGREDIENT_DELETE: (state, action) => {
      const targetIndex = action.payload;
      return dotProp.delete(state, `ingredients.${targetIndex}`);
    },
    IMGUPLOADER_ADD: (state, action) => {
      const { type } = action.payload;
      switch (type) {
        case 'History':
          const { historyId } = action.payload;
          const histories = state.histories;
          const index = _.findIndex(histories, ['id', historyId]);
          const history = histories[index];
          const images = _.get(history, 'images', []);

          const newNo =
            !images || images.length === 0
              ? 1
              : parseInt(images[images.length - 1].no + 1, 10);

          return dotProp.set(state, `histories.${index}.images`, [
            ...images,
            { url: '', no: newNo }
          ]);
        default:
          return state;
      }
    },
    IMG_UPLOAD_PENDING: (state, action) =>
      dotProp.set(state, 'uploading', true),
    IMG_UPLOAD_FULFILL: (state, action) => {
      const { type, no, url } = action.payload;

      if (type === 'History') {
        if (no) {
          const { historyId } = action.payload;
          const histories = state.histories;
          const index = _.findIndex(histories, ['id', historyId]);
          const history = histories[index];
          let images = history.images;

          images[no - 1].url = url;

          state = dotProp.set(state, `histories.${index}.images`, images);
          return dotProp.set(state, `uploading`, false);
        }
      }
      return {
        ...state,
        uploading: false,
        imgURL: url
      };
    },
    [combineActions(imgUploadReject, imgUploadCancel)](state, action) {
      return dotProp.set(state, 'uploading', false);
    },
    HISTORY_ADD: (state, action) => {
      let newHistoryId;
      if (!state.histories) {
        newHistoryId = 1;
        state = dotProp.set(state, 'histories', [
          { id: newHistoryId, date: moment().format('YYYY-MM-DD'), images: [] }
        ]);
      } else {
        const histories = state.histories;
        let lastId = 0;

        histories.forEach(history => {
          if (parseInt(history.id, 10) > lastId) {
            lastId = history.id;
          }
        });
        newHistoryId = lastId + 1;

        state = dotProp.set(state, 'historyId', newHistoryId);
        state = dotProp.set(state, 'histories', [
          ...histories,
          {
            id: newHistoryId,
            date: moment().format('YYYY-MM-DD'),
            images: []
          }
        ]);
      }
      state = dotProp.set(state, 'historyId', newHistoryId);
      return state;
    },
    HISTORY_EDIT: (state, action) => {
      const histories = state.histories;
      const historyId = parseInt(action.payload, 10);

      const index = _.findIndex(histories, ['id', historyId]);
      const history = histories[index];

      const hasDate = !!_.get(history, 'date');
      const date = hasDate
        ? _.get(history, 'date')
        : moment().format('YYYY/MM/DD');

      state = dotProp.set(state, `histories.${index}.date`, date);
      return dotProp.set(state, `historyId`, historyId);
    },
    HISTORY_REMARK_CHANGE: (state, action) => {
      const { remark, historyId } = action.payload;
      const histories = state.histories;

      const index = _.findIndex(histories, ['id', historyId]);

      return dotProp.set(state, `histories.${index}.remark`, remark);
    },
    HISTORY_DATE_CHANGE: (state, action) => {
      const { date, historyId } = action.payload;
      const histories = state.histories;

      const index = _.findIndex(histories, ['id', historyId]);

      return dotProp.set(state, `histories.${index}.date`, date);
    },
    HISTORY_UPDATE_PENDING: (state, action) => {
      return dotProp.set(state, 'updating', true);
    },
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
