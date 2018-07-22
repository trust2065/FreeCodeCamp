import _ from 'lodash';
import axios from 'axios';
import { createAction, handleActions, combineActions } from 'redux-actions';
import { combineReducers } from 'redux';
import dotProp from 'dot-prop-immutable';
import moment from 'moment';
import reduceReducers from 'reduce-reducers';
import FirebaseActions from '../core/FirebaseAction';

//===========
// Constants
//===========

export const PREFIX = 'historyDetail';

//=================
// Default State
//=================

const defaultState = {
  data: {
    name: '',
    histories: []
  },
  meta: {
    fetching: false,
    fetched: false,
    updating: false,
    updated: false,
    uploading: false,
    error: '',
    uploadingImgIndexs: {}
  }
};

//=================
// Action
//=================

export const imgUploaderAdd = createAction(
  `${PREFIX}/IMGUPLOADER_ADD`,
  historyId => ({ historyId })
);
export const imageDelete = createAction(
  `${PREFIX}/IMG_DELETE`,
  (imgIndex, historyId) => ({
    imgIndex,
    historyId
  })
);
export const imageSwitch = createAction(
  `${PREFIX}/IMG_SWITCH`,
  (sourceImgIndex, targetImgIndex, historyId) => ({
    sourceImgIndex,
    targetImgIndex,
    historyId
  })
);

const imgUploadFulfill = createAction(
  `${PREFIX}/imgUploadFulfill`,
  (url, imgIndex, historyId) => ({
    url,
    imgIndex,
    historyId
  })
);

const imgUploadPending = createAction(
  `${PREFIX}/IMG_UPLOAD_PENDING`,
  imgIndex => ({
    imgIndex
  })
);

const imgUploadReject = createAction(
  `${PREFIX}/IMG_UPLOAD_REJECT`,
  imgIndex => ({
    imgIndex
  })
);

const imgUploadCancel = createAction(
  `${PREFIX}/IMG_UPLOAD_CANCEL`,
  imgIndex => ({
    imgIndex
  })
);

export function imgUpload(e, imgIndex, historyId) {
  return dispatch => {
    dispatch(imgUploadPending(imgIndex));
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
          dispatch(imgUploadFulfill(imgURL, imgIndex, historyId));
        })
        .catch(error => {
          dispatch(imgUploadReject(imgIndex));
        });
    } else {
      dispatch(imgUploadCancel(imgIndex));
    }
  };
}

const recipeFetchPending = createAction(`${PREFIX}/RECIPE_FETCH_PENDING`);
const recipeFetchFulfill = createAction(
  `${PREFIX}/RECIPE_FETCH_FULFILL`,
  (recipe, recipeId) => ({
    recipe,
    recipeId
  })
);
const recipeFetchReject = createAction(`${PREFIX}/RECIPE_FETCH_REJECT`);

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
          dispatch(recipeFetchReject('recipe not exist'));
        }
      },
      err => {
        dispatch(recipeFetchReject(err));
      }
    );
  };
}

export const reset = createAction(`${PREFIX}/RESET`);

export const historyDateChange = createAction(
  `${PREFIX}/HISTORY_DATE_CHANGE`,
  (date, historyId) => ({ date, historyId })
);
export const historyRemarkChange = createAction(
  `${PREFIX}/HISTORY_REMARK_CHANGE`,
  (remark, historyId) => ({ remark, historyId })
);
export const historyAdd = createAction(`${PREFIX}/HISTORY_ADD`);
export const historyEdit = createAction(`${PREFIX}/HISTORY_EDIT`);

export const historyUpdatePending = createAction(
  `${PREFIX}/HISTORY_UPDATE_PENDING`
);
export const historyUpdateFulfill = createAction(
  `${PREFIX}/HISTORY_UPDATE_FULFILL`
);
export const historyUpdateReject = createAction(
  `${PREFIX}/HISTORY_UPDATE_REJECT`
);

export function historyUpdate(recipeId, histories) {
  return dispatch => {
    dispatch(historyUpdatePending());

    FirebaseActions.update(
      recipeId,
      {
        histories: histories
      },
      () => {
        dispatch(historyUpdateFulfill());
      },
      err => {
        dispatch(historyUpdateReject());
      }
    );
  };
}

//=================
// Handler & Function
//=================

const findMaxInArray = (array, prop, defaultValue) => {
  let max = defaultValue;
  array.forEach(element => {
    if (parseInt(element[prop], 10) > parseInt(max, 10)) {
      max = element[prop];
    }
  });
  return max;
};

const getLastNoFromProp = (images, prop) => {
  return !images || images.length === 0 ? 0 : findMaxInArray(images, prop, 0);
};

const imgUploaderAddHandler = (state, action) => {
  const { historyId } = action.payload;
  const histories = state.histories;

  const index = _.findIndex(histories, ['id', historyId]);
  const history = histories[index];

  const images = _.get(history, 'images', []);
  const newNo = getLastNoFromProp(images, 'no') + 1;

  return dotProp.set(state, `histories.${index}.images`, [
    ...images,
    { url: '', no: newNo }
  ]);
};

const imgUploadPendingHandler = (state, action) => {
  const { imgIndex } = action.payload;

  state = dotProp.merge(state, `meta.uploadingImgIndexs`, {
    [imgIndex]: true
  });
  console.log(JSON.stringify(state.meta.uploadingImgIndexs));
  return state;
};
const imageDeleteHandler = (state, action) => {
  const imgIndex = action.payload.imgIndex;
  const historyId = action.payload.historyId;
  const histories = state.histories;
  const historyIndex = _.findIndex(histories, ['id', historyId]);

  state = dotProp.delete(state, `histories.${historyIndex}.images.${imgIndex}`);
  return state;
};

const imageSwitchHandler = (state, { payload }) => {
  const { sourceImgIndex, targetImgIndex, historyId } = payload;
  const histories = state.histories;
  const historyIndex = _.findIndex(histories, ['id', historyId]);
  const history = histories[historyIndex];
  const images = history.images;

  const imageSource = images[sourceImgIndex];
  const imageTarget = images[targetImgIndex];

  state = dotProp.set(
    state,
    `histories.${historyIndex}.images.${sourceImgIndex}`,
    imageTarget
  );
  state = dotProp.set(
    state,
    `histories.${historyIndex}.images.${targetImgIndex}`,
    imageSource
  );

  return state;
};

const historyAddHandler = (state, action) => {
  let newHistoryId;
  if (!state.histories) {
    newHistoryId = 1;
    state = dotProp.set(state, 'histories', [
      {
        id: newHistoryId,
        date: moment().format('YYYY-MM-DD'),
        images: []
      }
    ]);
  } else {
    const histories = state.histories;

    newHistoryId = findMaxInArray(histories, 'id', 0) + 1;

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
  // set date today if not exist
  if (!hasDate) {
    const date = moment().format('YYYY/MM/DD');
    state = dotProp.set(state, `histories.${index}.date`, date);
  }
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

//=================
// Reducer
//=================

const dataReducer = handleActions(
  {
    [recipeFetchFulfill]: (state, action) => {
      const recipe = action.payload.recipe;
      return {
        ...state,
        name: recipe.name,
        histories: recipe.histories
      };
    },
    [imgUploaderAdd]: imgUploaderAddHandler,
    [historyAdd]: historyAddHandler,
    [historyEdit]: historyEditHandler,
    [historyRemarkChange]: historyRemarkChangeHandler,
    [historyDateChange]: historyDateChangeHandler,
    [imgUploadFulfill]: (state, { payload }) => {
      const { imgIndex, url } = payload;
      if (imgIndex >= 0) {
        const { historyId } = payload;
        const histories = state.histories;
        const historyIndex = _.findIndex(histories, ['id', historyId]);

        state = dotProp.set(
          state,
          `histories.${historyIndex}.images.${imgIndex}.url`,
          url
        );

        return state;
      }
    },
    [imageDelete]: imageDeleteHandler,
    [imageSwitch]: imageSwitchHandler
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
    [recipeFetchReject]: (state, action) => {
      const error = action.payload;
      return {
        ...state,
        fetching: false,
        error: error
      };
    },
    [reset]: (state, action) => {
      return dotProp.set(state, 'updated', false);
    },
    [imgUploadFulfill]: (state, { payload }) => {
      const { imgIndex } = payload;
      if (imgIndex >= 0) {
        state = dotProp.delete(state, `uploadingImgIndexs.${imgIndex}`);
        console.log(JSON.stringify(state.uploadingImgIndexs));
        return state;
      }
    },
    [combineActions(imgUploadReject, imgUploadCancel)](state, { payload }) {
      const { imgIndex } = payload;
      if (imgIndex) {
        state = dotProp.delete(state, `uploadingImgIndexs.${imgIndex}`);
      }
      return dotProp.set(state, 'uploading', false);
    },
    [historyUpdatePending]: (state, action) => {
      return dotProp.set(state, 'updating', true);
    },
    [historyUpdateFulfill]: (state, action) => ({
      ...state,
      updating: false,
      updated: true
    }),
    [historyUpdateReject]: (state, action) => ({
      ...state,
      error: action.payload,
      fetching: false
    })
  },
  defaultState.meta
);

const reducer = combineReducers({
  data: dataReducer,
  meta: metaReducer
});

const crossSliceReducer = handleActions(
  { [imgUploadPending]: imgUploadPendingHandler },
  defaultState
);

export default reduceReducers(reducer, crossSliceReducer);
