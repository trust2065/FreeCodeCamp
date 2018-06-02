import {
  createAction,
  createActions,
  handleActions,
  combineActions
} from 'redux-actions';
import database from '../components/Firebase';
import RecipeDao from '../components/RecipeDao';
import axios from 'axios';

export const imgUploaderAdd = createAction('IMGUPLOADER_ADD');

const {
  imgUploadPending,
  imgUploadFulfill,
  imgUploadReject,
  imgUploadCancel
} = createActions(
  {
    IMG_UPLOAD_FULFILL: (url, type, no) => ({ url, type, no })
  },
  'IMG_UPLOAD_PENDING',
  'IMG_UPLOAD_REJECT',
  'IMG_UPLOAD_CANCEL'
);

export function imgUpload(e, type = 'recipe', no = 0) {
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
          dispatch(imgUploadFulfill(imgURL, type, no));
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
    recipeRef.on(
      'value',
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
  imgURLHistory: []
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

      if (!recipe.hasOwnProperty('ingredients')) {
        recipe.ingredients = [];
      }
      if (!recipe.hasOwnProperty('steps')) {
        recipe.steps = [];
      }
      return {
        ...state,
        fetching: false,
        fetched: true,
        imgURL: recipe.imgURL,
        ingredients: recipe.ingredients,
        name: recipe.name,
        recipeId: recipeId,
        steps: recipe.steps
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
      switch (action.payload) {
        case 'History':
          let imgURLHistory = [...state.imgURLHistory];
          let newNo;
          if (imgURLHistory.length === 0) {
            newNo = 1;
          } else {
            newNo = parseInt(
              imgURLHistory[imgURLHistory.length - 1].no + 1,
              10
            );
          }
          imgURLHistory.push({ url: '', no: newNo });
          return { ...state, imgURLHistory: imgURLHistory };
        default:
          return state;
      }
    },
    IMG_UPLOAD_PENDING: (state, action) => ({ ...state, uploading: true }),
    IMG_UPLOAD_FULFILL: (state, action) => {
      const { type, no, url } = action.payload;
      let imgURLHistory = [...state.imgURLHistory];

      if (type === 'History') {
        if (no) {
          imgURLHistory[no - 1].url = url;
        }
      }
      return {
        ...state,
        uploading: false,
        imgURL: url,
        imgURLHistory: imgURLHistory
      };
    },
    [combineActions(imgUploadReject, imgUploadCancel)](state, action) {
      return { ...state, uploading: false };
    }
  },
  defaultState
);

export default reducer;
