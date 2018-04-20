import React from 'react';
import ReactDOM from 'react-dom';
import './css/Recipe.css';
// import App from "./components/App";
import Recipe from "./components/Recipe";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Recipe />, document.getElementById("root"));
registerServiceWorker();

