import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class Ingredient extends Component {
  render() {
    return <input type="text" className="form-control" value={this.props.name} />;
  }
}

export default Ingredient;
