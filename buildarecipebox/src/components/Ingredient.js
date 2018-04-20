import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class Ingredient extends Component {
  render() {
    return <input type="text" className="form-control" defaultValue={this.props.name} placeholder="new ingredient" />;  
  }
}

export default Ingredient;
