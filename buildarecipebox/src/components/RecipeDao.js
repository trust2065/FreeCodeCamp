import database from "./Firebase.js";

export function get(id = '2', callback) {
  console.log("getRecipe");

  let recipeRef = database.ref(`recipe/${id}`);
  recipeRef.on("value", function(snapshot) {
    console.log("getRecipe result: ");
    let recipe = snapshot.val();
    console.log(recipe);
    if (callback) {
      callback(recipe);
    }
    return ;
  });
}

export function update(id = 'A2', data) {
  console.log("updateRecipe");

  let {name, ingredients, steps} = data;

  database
    .ref("recipe/" + id)
    .update({ name: name, ingredients: ingredients, steps: steps })
    .catch(function(error) {
      console.error("update錯誤", error);
    });
}

// export default updateRecipe;
export default { get, update };