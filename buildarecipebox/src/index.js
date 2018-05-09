import React from 'react';
import ReactDOM from 'react-dom';
import './css/Recipe.css';
// import App from "./components/App";
import Recipe from './components/Recipe';
import Home from './components/Home';
import Header from './components/Header';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore } from 'redux';

ReactDOM.render(
  <Router>
    <div>
      <Route path="/" render={() => <Header title="Site for Your Recipes" />} />
      <Route exact path="/" component={Home} />
      <Route path="/recipe/:id" component={Recipe} />
    </div>
  </Router>,
  document.getElementById('root')
);

registerServiceWorker();
