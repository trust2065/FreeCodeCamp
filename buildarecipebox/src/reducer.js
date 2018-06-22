import { combineReducers } from 'redux';
import recipe from './modules/recipe/reducer';
import history from './modules/history/reducer';

export default combineReducers({
  recipe,
  history
});
