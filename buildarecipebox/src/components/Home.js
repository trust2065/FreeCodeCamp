import React, { Component } from "react";
import { Link } from "react-router-dom";

class Step extends Component {
  render() {
    return <div>
        <h1>Home</h1>
        <Link to="/recipe/100">
          <button>Show the Recipe</button>
        </Link>
      </div>;
  }
}

export default Step;
