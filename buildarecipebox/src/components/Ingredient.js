import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import { Button } from '../components';

class Ingredient extends Component {
  static propTypes = {
    name: PropTypes.string
  };
  render() {
    return (
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={this.props.name}
          onChange={e => this.props.onChange(e)}
          placeholder="new ingredient"
        />
        <div className="input-group-append">
          <Button onClick={this.props.onDelete} className="input-group-text">
            X
          </Button>
        </div>
      </div>
    );
  }
}

export default Ingredient;
