import Firebase from './Firebase';

function getOnce(recipeId, callbackSuccess, callbackErr) {
  const recipeRef = Firebase.ref(`recipe/${recipeId}`);

  // have to return if you want to chain other action
  return recipeRef.once('value').then(
    snapshot => {
      callbackSuccess(snapshot);
    },
    err => {
      callbackErr(err);
    }
  );
}

function update(recipeId, data, callbackSuccess, callbackErr) {
  const recipeRef = Firebase.ref('recipe/' + recipeId);

  recipeRef
    .update(data)
    .then(() => {
      if (callbackSuccess) {
        callbackSuccess();
      }
    })
    .catch(error => {
      callbackErr(error);
    });
}

// export default {};
export default { getOnce, update };
