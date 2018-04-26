import React from 'react';
import ReactDOM from 'react-dom';
import './css/Recipe.css';
// import App from "./components/App";
import Recipe from "./components/Recipe";
import Home from "./components/Home";
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from "react-router-dom";

      // <Route path="/recipe/:id" render={props => <Recipe {...props} />} />
ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/recipe/:id" component={Recipe} />
    </div>
  </Router>,
  document.getElementById("root")
);
// ReactDOM.render(<Recipe />, document.getElementById("root"));
registerServiceWorker();

