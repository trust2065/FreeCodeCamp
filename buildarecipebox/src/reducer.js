import { combineReducers } from 'redux';
import recipe from './modules/recipe/reducer';
import history from './modules/history/reducer';
import historyDetail from './modules/historyDetail/reducer';

export default combineReducers({
  recipe,
  history,
  historyDetail
});
