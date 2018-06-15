import Firebase from './Firebase';

export function get(id, callback) {
  console.log('getRecipe');

  let recipeRef = Firebase.ref(`recipe/${id}`);
  recipeRef.on('value', function(snapshot) {
    // console.log('getRecipe result: ');
    let recipe = snapshot.val();
    // console.log(recipe);
    if (callback) {
      callback(recipe);
    }
    return;
  });
}

export function update(id, data, callback) {
  console.log(`updateRecipe, id: ${id}`);

  let { name, ingredients, steps } = data;

  Firebase.ref('recipe/' + id)
    .update({ name: name, ingredients: ingredients, steps: steps })
    .then(() => {
      if (callback) {
        callback();
      }
    })
    .catch(function(error) {
      console.error('update錯誤', error);
    });
}

export function getList(callback) {
  console.log('getRecipeList');
  Firebase.ref('recipe').once('value', function(snapshot) {
    if (callback) {
      callback(snapshot);
    }
  });
}

// export default updateRecipe;
export default { get, getList, update };
