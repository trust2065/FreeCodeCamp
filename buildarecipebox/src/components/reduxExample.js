import { createStore } from 'redux';

const reducer = function(type, state) {
  switch (type) {
    case 'INC':
      return state + 1;

    default:
      break;
  }
};

const store = createStore(reducer, 0);

store.subscribe(() => {
  console.log('store changed', store.getState());
});

store.dispatch({ type: 'INC', payload: 1 });
