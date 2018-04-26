import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class Ingredient extends Component {
  render() {
    return (
      <input
        type="text"
        className="form-control"
        value={this.props.name}
        onChange={(e) => this.props.onChange(e)}
        placeholder="new ingredient"
      />
    );
    // return <input type="text" className="form-control" defaultValue={this.props.name} placeholder="new ingredient" />;
  }
}

export default Ingredient;
