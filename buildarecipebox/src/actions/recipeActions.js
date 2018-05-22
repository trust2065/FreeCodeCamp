import database from '../components/Firebase';
import RecipeDao from '../components/RecipeDao';
import axios from 'axios';

export function RECIPE_FETCH(recipeId) {
  return dispatch => {
    dispatch({
      type: 'RECIPE_FETCH_PENDING'
    });
    const recipeRef = database.ref(`recipe/${recipeId}`);
    recipeRef.on(
      'value',
      function(snapshot) {
        let recipe = snapshot.val();
        // console.log('recipe');
        // console.log(recipe);
        if (recipe) {
          dispatch({
            type: 'RECIPE_FETCH_FULFILL',
            payload: { recipe: recipe, recipeId: recipeId }
          });
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
            dispatch({
              type: 'RECIPE_FETCH_FULFILL_NEWRECIPE',
              payload: newRecipeId
            });
          });
        }
      },
      function(err) {
        dispatch({
          type: 'RECIPE_FETCH_REJECT',
          payload: err
        });
      }
    );
  };
}

export function RECIPE_UPDATE(recipeId, name, ingredients, steps, imgURL) {
  return dispatch => {
    dispatch({
      type: 'RECIPE_UPDATE_PENDING'
    });
    database
      .ref('recipe/' + recipeId)
      .update({
        name: name,
        ingredients: ingredients,
        steps: steps,
        imgURL: imgURL
      })
      .then(() => {
        dispatch({
          type: 'RECIPE_UPDATE_FULFILL'
        });
      })
      .catch(function(err) {
        dispatch({
          type: 'RECIPE_UPDATE_REJECT',
          payload: err
        });
      });
  };
}

export function NAME_CHANGE(name) {
  return {
    type: 'NAME_CHANGE',
    payload: name
  };
}

export function INGREDIENT_CHANGE(order, changedText) {
  return {
    type: 'INGREDIENT_CHANGE',
    payload: { order: order, changedText: changedText }
  };
}

export function STEP_CHANGE(order, changedText) {
  return {
    type: 'STEP_CHANGE',
    payload: { order: order, changedText: changedText }
  };
}

export function RESET() {
  return {
    type: 'RESET'
  };
}

export function STEP_ADD() {
  return {
    type: 'STEP_ADD'
  };
}

export function INGREDIENT_ADD() {
  return {
    type: 'INGREDIENT_ADD'
  };
}

export function GET_NEWID_FULFILL() {
  return {
    type: 'GET_NEWID_FULFILL'
  };
}

export function STEP_DELETE(i) {
  return {
    type: 'STEP_DELETE',
    payload: i
  };
}

export function INGREDIENT_DELETE(i) {
  return {
    type: 'INGREDIENT_DELETE',
    payload: i
  };
}

export function IMG_CHANGE(link) {
  return {
    type: 'IMG_CHANGE',
    payload: link
  };
}

export function IMG_UPLOAD(e) {
  return dispatch => {
    dispatch({
      type: 'IMG_UPLOAD_PENDING'
    });
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
          dispatch({
            type: 'IMG_UPLOAD_FULFILL',
            payload: imgURL
          });
        })
        .catch(error => {
          dispatch({
            type: 'IMG_UPLOAD_REJECT',
            payload: error
          });
        });
    }
  };
}
