import RecipeDao from '../components/RecipeDao';
import { GET_NEWID_FULFILL } from '../actions/recipeActions';

export default (
  state = {
    recipeId: 0,
    name: '',
    ingredients: [],
    steps: [],
    fetching: false,
    fetched: false,
    updating: false,
    updated: false
  },
  action
) => {
  let steps;
  let ingredients;
  switch (action.type) {
    case 'FETCH_RECIPE_PENDING':
      return { ...state, fetching: true };
    case 'FETCH_RECIPE_FULFILL_NEWRECIPE':
      return {
        ...state,
        recipeId: action.payload,
        fetching: false,
        fetched: true
      };
    case 'FETCH_RECIPE_FULFILL':
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
        steps: recipe.steps,
        ingredients: recipe.ingredients,
        name: recipe.name,
        fetching: false,
        fetched: true,
        recipeId: recipeId
      };
    case 'FETCH_RECIPE_REJECT':
      return { ...state, error: action.payload, fetching: false };
    case 'NAME_CHANGE':
      return { ...state, name: action.payload };
    case 'INGREDIENT_CHANGE':
      let ingredients = [...state.ingredients];
      ingredients[action.payload.order].name = action.payload.changedText;
      return { ...state, ingredients: ingredients };
    case 'STEP_CHANGE':
      steps = [...state.steps];
      steps[action.payload.order].desp = action.payload.changedText;
      return { ...state, steps: steps };
    case 'UPDATE_RECIPE_PENDING':
      return { ...state, updating: true };
    case 'UPDATE_RECIPE_FULFILL':
      return { ...state, updating: false, updated: true };
    case 'UPDATE_RECIPE_REJECT':
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
  }
  return state;
};
