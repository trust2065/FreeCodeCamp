export default (
  state = {
    recipeId: 0,
    name: '',
    ingredients: [],
    steps: [],
    fetching: false,
    fetched: false,
    updating: false,
    updated: false,
    uploading: false,
    uploaded: false,
    imgURL: ''
  },
  action
) => {
  let steps;
  let ingredients;
  let targetIndex;

  switch (action.type) {
    case 'RECIPE_FETCH_PENDING':
      return { ...state, fetching: true };
    case 'RECIPE_FETCH_FULFILL_NEWRECIPE':
      return {
        ...state,
        recipeId: action.payload,
        fetching: false,
        fetched: true
      };
    case 'RECIPE_FETCH_FULFILL':
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
    case 'RECIPE_FETCH_REJECT':
      return { ...state, error: action.payload, fetching: false };
    case 'NAME_CHANGE':
      return { ...state, name: action.payload };
    case 'INGREDIENT_CHANGE':
      ingredients = [...state.ingredients];
      ingredients[action.payload.order].name = action.payload.changedText;
      return { ...state, ingredients: ingredients };
    case 'STEP_CHANGE':
      steps = [...state.steps];
      steps[action.payload.order].desp = action.payload.changedText;
      return { ...state, steps: steps };
    case 'RECIPE_UPDATE_PENDING':
      return { ...state, updating: true };
    case 'RECIPE_UPDATE_FULFILL':
      return { ...state, updating: false, updated: true };
    case 'RECIPE_UPDATE_REJECT':
      return { ...state, updating: false, error: action.payload };
    case 'RESET':
      return { ...state, updated: false };
    case 'STEP_ADD':
      steps = [...state.steps];
      let newStep;
      if (steps.length === 0) {
        newStep = 1;
      } else {
        newStep = parseInt(steps[steps.length - 1].step + 1, 10);
      }
      steps.push({ desp: '', step: newStep });
      return { ...state, steps: steps };
    case 'INGREDIENT_ADD':
      ingredients = [...state.ingredients];
      ingredients.push({ name: '' });
      return { ...state, ingredients: ingredients };
    case 'STEP_DELETE':
      targetIndex = action.payload;
      steps = [...state.steps];
      steps.splice(targetIndex, 1);
      steps = steps.map((step, i) => {
        if (i >= targetIndex) {
          step.step = step.step - 1;
        }
        return step;
      });
      return { ...state, steps: steps };
    case 'INGREDIENT_DELETE':
      targetIndex = action.payload;
      ingredients = [...state.ingredients];
      ingredients.splice(targetIndex, 1);
      return { ...state, ingredients: ingredients };
    case 'IMG_UPLOAD_PENDING':
      return { ...state, uploading: true };
    case 'IMG_UPLOAD_FULFILL':
      return {
        ...state,
        uploading: false,
        uploaded: true,
        imgURL: action.payload
      };
    case 'IMG_UPLOAD_REJECT':
      return {
        ...state,
        uploading: false,
        error: action.payload
      };

    default:
      return state;
  }
};
