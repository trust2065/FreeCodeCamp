import React from 'react';
import ReactDOM from 'react-dom';
import dotProp from 'dot-prop-immutable';

// set> 幫你spread第一個參數，第二個參數是指定的路徑，
// 只有這個路徑會被copy且修改 (shallow copy, 代表除此路徑以外，此路徑以下的物件都不會改變reference)

// 證明以上的觀點
var state = { todos: ['test', { list: [1, 2, 3] }] };

// 只要用dotProp set過的物件，都是不同的物件，即使值都沒改
let newState = dotProp.set(state, 'todos');
// 證明即使值相同，仍卻是不同的物件
console.log(state === newState);

// 只改指定的字串，不去動list
newState = dotProp.set(state, 'todos[0]', 'testing');
console.log(state);
console.log(newState);
// 這裡和前面結果一樣，是不同物件，且值也不相同
console.log(state === newState);

// 證明除了是shallow copy，並且只改指定路徑的值
console.log(state[1] === newState[1]);

// var state = { todos: [], test: true };

// // Add todo:
// const newState = dotProp.set(state, 'todos', list => [
//   ...list,
//   { text: 'cleanup', complete: false }
// ]);

// console.log(state);
// console.log(newState);

// console.log(state === newState);
// console.log(state.todos === newState.todos);

// shallow copy State -> todos will still point to the same object
// const duplicateState = { ...state, test: true };

// console.log(state);
// console.log(duplicateState);

// console.log(state === duplicateState);
// console.log(state.todos === duplicateState.todos);

// // use dotProp
// const newState2 = dotProp.set(state, 'test', true);

// console.log(state);
// console.log(newState2);

// console.log(state === newState2);
// console.log(state.todos === newState2.todos);

let test = <div>TEST</div>;

ReactDOM.render(test, document.getElementById('root'));
