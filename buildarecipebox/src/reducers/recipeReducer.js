import _ from 'lodash';
import axios from 'axios';
import {
  createAction,
  createActions,
  handleActions,
  combineActions
} from 'redux-actions';
import database from '../modules/core/Firebase';
import FirebaseActions from '../modules/core/FirebaseAction';
import dotProp from 'dot-prop-immutable';
import moment from 'moment';

export const imgUploaderAdd = createAction(
  'IMGUPLOADER_ADD',
  (type, historyId) => ({ type, historyId })
);
export const imageDelete = createAction(
  'IMG_DELETE',
  (type, no, historyId) => ({
    type,
    no,
    historyId
  })
);
export const imageSwitch = createAction(
  'IMG_SWITCH',
  (type, sourceNo, targetNo, historyId) => ({
    type,
    sourceNo,
    targetNo,
    historyId
  })
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
          FirebaseActions.getList(snapshot => {
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

const nameChangeHandler = (state, action) =>
  dotProp.set(state, 'name', action.payload);

const recipeFetchPendingHandler = state => dotProp.set(state, 'fetching', true);

const recipeFetchFulfillNewrecipeHandler = (state, action) => {
  const recipeId = action.payload;
  return dotProp.set(defaultState, 'recipeId', recipeId);
};

const recipeFetchFulfillHandler = (state, action) => {
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
};

const recipeFetctRejectHandler = (state, action) => {
  const error = action.payload;
  return {
    ...state,
    fetching: false,
    error: error
  };
};

const recipeUpdatePendingHandler = (state, action) =>
  dotProp.set(state, 'updating', true);

const recipeUpdateFulfillHandler = (state, action) => ({
  ...state,
  updating: false,
  updated: true
});

const recipeUpdateRejectHandler = (state, action) => {
  const error = action.payload;
  return {
    ...state,
    error: error,
    fetching: false
  };
};

const resetHandler = (state, action) => {
  return dotProp.set(state, 'updated', false);
};

const stepChangeHandler = (state, action) => {
  const changedText = action.payload.changedText;
  const order = action.payload.order;
  return dotProp.set(state, `steps.${order}.desp`, changedText);
};

const stepAddHandler = (state, action) => {
  return dotProp.set(state, 'steps', [...state.steps, { desp: '' }]);
};

const stepDeleteHandler = (state, action) => {
  const targetIndex = action.payload;
  return dotProp.delete(state, `steps.${targetIndex}`);
};

const stepHandlers = {
  [stepChange]: stepChangeHandler,
  [stepAdd]: stepAddHandler,
  [stepDelete]: stepDeleteHandler
};

const ingredientChangeHandler = (state, action) => {
  const changedText = action.payload.changedText;
  const order = action.payload.order;
  return dotProp.set(state, `ingredients.${order}.name`, changedText);
};

const ingredientAddHandler = (state, action) => {
  return dotProp.set(state, 'ingredients', [
    ...state.ingredients,
    { name: '' }
  ]);
};

const ingredientDeleteHandler = (state, action) => {
  const targetIndex = action.payload;
  return dotProp.delete(state, `ingredients.${targetIndex}`);
};

const ingredientChangeHandlers = {
  [ingredientChange]: ingredientChangeHandler,
  [ingredientAdd]: ingredientAddHandler,
  [ingredientDelete]: ingredientDeleteHandler
};

const findMaxInArray = (array, prop, defaultValue) => {
  let max = defaultValue;
  array.forEach(element => {
    if (parseInt(element[prop], 10) > parseInt(max, 10)) {
      max = element[prop];
    }
  });
  return max + 1;
  // parseInt(images[images.length - 1].no + 1, 10);
};

const imgUploaderAddHandler = (state, action) => {
  const { type } = action.payload;
  switch (type) {
    case 'History':
      const { historyId } = action.payload;
      const histories = state.histories;
      const index = _.findIndex(histories, ['id', historyId]);
      const history = histories[index];
      const images = _.get(history, 'images', []);

      const newNo =
        !images || images.length === 0 ? 1 : findMaxInArray(images, 'no', 1);

      return dotProp.set(state, `histories.${index}.images`, [
        ...images,
        { url: '', no: newNo }
      ]);
    default:
      return state;
  }
};

const imgUploadPendingHandler = (state, action) =>
  dotProp.set(state, 'uploading', true);

const imgUploadFulfillHandler = (state, action) => {
  const { type, no, url } = action.payload;

  if (type === 'History') {
    if (no) {
      const { historyId } = action.payload;
      const histories = state.histories;
      const historyIndex = _.findIndex(histories, ['id', historyId]);
      const history = histories[historyIndex];
      const images = history.images;
      const imageIndex = _.findIndex(images, ['no', no]);

      state = dotProp.set(
        state,
        `histories.${historyIndex}.images.${imageIndex}.url`,
        url
      );
      return dotProp.set(state, `uploading`, false);
    }
  }
  return {
    ...state,
    uploading: false,
    imgURL: url
  };
};

const imageDeleteHandler = (state, action) => {
  const type = action.payload.type;
  if (type === 'History') {
    const no = action.payload.no;
    const historyId = action.payload.historyId;
    const histories = state.histories;
    const historyIndex = _.findIndex(histories, ['id', historyId]);

    const history = histories[historyIndex];
    const images = history.images;

    const imageIndex = _.findIndex(images, ['no', no]);

    state = dotProp.delete(
      state,
      `histories.${historyIndex}.images.${imageIndex}`
    );
  }
  return state;
};

const imageSwitchHandler = (state, action) => {
  const type = action.payload.type;
  if (type === 'History') {
    const sourceNo = action.payload.sourceNo;
    const targetNo = action.payload.targetNo;
    const historyId = action.payload.historyId;
    const histories = state.histories;
    const historyIndex = _.findIndex(histories, ['id', historyId]);

    const history = histories[historyIndex];
    const images = history.images;

    const imageSourceIndex = _.findIndex(images, ['no', sourceNo]);
    const imageTargetIndex = _.findIndex(images, ['no', targetNo]);
    const imageSource = images[imageSourceIndex];
    const imageTarget = images[imageTargetIndex];

    state = dotProp.set(
      state,
      `histories.${historyIndex}.images.${imageSourceIndex}`,
      imageTarget
    );
    state = dotProp.set(
      state,
      `histories.${historyIndex}.images.${imageTargetIndex}`,
      imageSource
    );
  }
  return state;
};

const imageHandlers = {
  [imgUploadPending]: imgUploadPendingHandler,
  [imgUploadFulfill]: imgUploadFulfillHandler,
  [imageDelete]: imageDeleteHandler,
  [imageSwitch]: imageSwitchHandler,
  [combineActions(imgUploadReject, imgUploadCancel)](state, action) {
    return dotProp.set(state, 'uploading', false);
  }
};

const historyAddHandler = (state, action) => {
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
};

const historyEditHandler = (state, action) => {
  const histories = state.histories;
  const historyId = parseInt(action.payload, 10);

  const index = _.findIndex(histories, ['id', historyId]);
  const history = histories[index];

  const hasDate = !!_.get(history, 'date');
  const date = hasDate ? _.get(history, 'date') : moment().format('YYYY/MM/DD');

  state = dotProp.set(state, `histories.${index}.date`, date);
  return dotProp.set(state, `historyId`, historyId);
};

const historyRemarkChangeHandler = (state, action) => {
  const { remark, historyId } = action.payload;
  const histories = state.histories;

  const index = _.findIndex(histories, ['id', historyId]);

  return dotProp.set(state, `histories.${index}.remark`, remark);
};

const historyDateChangeHandler = (state, action) => {
  const { date, historyId } = action.payload;
  const histories = state.histories;

  const index = _.findIndex(histories, ['id', historyId]);

  return dotProp.set(state, `histories.${index}.date`, date);
};

const historyUpdatePendingHandler = (state, action) => {
  return dotProp.set(state, 'updating', true);
};

const historyUpdateFulfillHandler = (state, action) => ({
  ...state,
  updating: false,
  updated: true
});

const historyUpdateRejectHandler = (state, action) => ({
  ...state,
  error: action.payload,
  fetching: false
});

const historyHandlers = {
  [historyAdd]: historyAddHandler,
  [historyEdit]: historyEditHandler,
  [historyRemarkChange]: historyRemarkChangeHandler,
  [historyDateChange]: historyDateChangeHandler,
  [historyUpdatePending]: historyUpdatePendingHandler,
  [historyUpdateFulfill]: historyUpdateFulfillHandler,
  [historyUpdateReject]: historyUpdateRejectHandler
};

const recipeFetchHandlers = {
  [recipeFetchPending]: recipeFetchPendingHandler,
  [recipeFetchFulfillNewrecipe]: recipeFetchFulfillNewrecipeHandler,
  [recipeFetchFulfill]: recipeFetchFulfillHandler,
  [recipeFetctReject]: recipeFetctRejectHandler
};

const recipeUpdateHandlers = {
  [recipeUpdatePending]: recipeUpdatePendingHandler,
  [recipeUpdateFulfill]: recipeUpdateFulfillHandler,
  [recipeUpdateReject]: recipeUpdateRejectHandler
};

const reducer = handleActions(
  {
    [nameChange]: nameChangeHandler,
    ...recipeFetchHandlers,
    ...recipeUpdateHandlers,
    [reset]: resetHandler,
    ...stepHandlers,
    ...ingredientChangeHandlers,
    [imgUploaderAdd]: imgUploaderAddHandler,
    ...imageHandlers,
    ...historyHandlers
  },
  defaultState
);

export default reducer;
