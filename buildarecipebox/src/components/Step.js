import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class Step extends Component {
  render() {
    return <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="stepAddon">
            {this.props.step}
          </span>
        </div>
        <input type="text" class="form-control" aria-describedby="stepAddon" defaultValue={this.props.desp} placeholder="new step" />
      </div>;
  }
}

export default Step;