import _ from 'lodash';
import axios from 'axios';
import { createAction, handleActions, combineActions } from 'redux-actions';
import { combineReducers } from 'redux';
import database from '../core/Firebase';
import dotProp from 'dot-prop-immutable';
import moment from 'moment';
import reduceReducers from 'reduce-reducers';

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
    uploadingImageNos: {}
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
  (no, historyId) => ({
    no,
    historyId
  })
);
export const imageSwitch = createAction(
  `${PREFIX}/IMG_SWITCH`,
  (sourceNo, targetNo, historyId) => ({
    sourceNo,
    targetNo,
    historyId
  })
);

const imgUploadFulfill = createAction(
  `${PREFIX}/imgUploadFulfill`,
  (url, imgNo, historyId) => ({
    url,
    imgNo,
    historyId
  })
);

const imgUploadPending = createAction(
  `${PREFIX}/IMG_UPLOAD_PENDING`,
  imgNo => ({
    imgNo
  })
);

const imgUploadReject = createAction(`${PREFIX}/IMG_UPLOAD_REJECT`, imgNo => ({
  imgNo
}));

const imgUploadCancel = createAction(`${PREFIX}/IMG_UPLOAD_CANCEL`, imgNo => ({
  imgNo
}));

export function imgUpload(e, imgNo = 0, historyId) {
  return dispatch => {
    dispatch(imgUploadPending(imgNo));
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
          dispatch(imgUploadFulfill(imgURL, imgNo, historyId));
        })
        .catch(error => {
          dispatch(imgUploadReject(imgNo));
        });
    } else {
      dispatch(imgUploadCancel(imgNo));
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
    const recipeRef = database.ref(`recipe/${recipeId}`);

    return recipeRef.once('value').then(
      function(snapshot) {
        let recipe = snapshot.val();
        if (recipe) {
          dispatch(recipeFetchFulfill(recipe, recipeId));
        } else {
          dispatch(recipeFetchReject('recipe not exist'));
        }
      },
      function(err) {
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
  const no = action.payload.no;

  state = dotProp.set(state, `meta.uploadingImageNos`, {
    [no]: true
  });
  return state;
};
const imageDeleteHandler = (state, action) => {
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
  return state;
};

const imageSwitchHandler = (state, action) => {
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
      const { imgNo, url } = payload;
      if (imgNo) {
        const { historyId } = payload;
        const histories = state.histories;
        const historyIndex = _.findIndex(histories, ['id', historyId]);
        const history = histories[historyIndex];
        const images = history.images;
        const imageIndex = _.findIndex(images, ['no', imgNo]);

        state = dotProp.set(
          state,
          `histories.${historyIndex}.images.${imageIndex}.url`,
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
      const { imgNo } = payload;
      if (imgNo) {
        state = dotProp.delete(state, `uploadingImageNos.${imgNo}`);
        return state;
      }
    },
    [combineActions(imgUploadReject, imgUploadCancel)](state, { payload }) {
      const { imgNo } = payload;
      if (imgNo) {
        state = dotProp.delete(state, `uploadingImageNos.${imgNo}`);
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
