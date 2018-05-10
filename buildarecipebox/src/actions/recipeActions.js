import database from '../components/Firebase';
import RecipeDao from '../components/RecipeDao';

export function FETCH_RECIPE(recipeId) {
  return dispatch => {
    dispatch({
      type: 'FETCH_RECIPE_PENDING'
    });
    const recipeRef = database.ref(`recipe/${recipeId}`);
    recipeRef.on(
      'value',
      function(snapshot) {
        let recipe = snapshot.val();
        console.log('recipe');
        console.log(recipe);
        if (recipe) {
          dispatch({
            type: 'FETCH_RECIPE_FULFILL',
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
              type: 'FETCH_RECIPE_FULFILL_NEWRECIPE',
              payload: newRecipeId
            });
          });
        }
      },
      function(err) {
        dispatch({
          type: 'FETCH_RECIPE_REJECT',
          payload: err
        });
      }
    );
  };
}

export function UPDATE_RECIPE(recipeId, name, ingredients, steps) {
  return dispatch => {
    dispatch({
      type: 'UPDATE_RECIPE_PENDING'
    });
    database
      .ref('recipe/' + recipeId)
      .update({ name: name, ingredients: ingredients, steps: steps })
      .then(() => {
        dispatch({
          type: 'UPDATE_RECIPE_FULFILL'
        });
      })
      .catch(function(err) {
        dispatch({
          type: 'UPDATE_RECIPE_REJECT',
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
