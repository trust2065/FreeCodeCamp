import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class Step extends Component {
  render() {
    return <div>
        <p>{this.props.step}</p>
        <input type="text" className="form-control" value={this.props.desp} />
      </div>;
  }
}

export default Step;
