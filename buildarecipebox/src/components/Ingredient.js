import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';

class Ingredient extends Component {
  static propTypes = {
    name: PropTypes.string
  };
  render() {
    return (
      <input
        type="text"
        className="form-control"
        value={this.props.name}
        onChange={e => this.props.onChange(e)}
        placeholder="new ingredient"
      />
    );
    // return <input type="text" className="form-control" defaultValue={this.props.name} placeholder="new ingredient" />;
  }
}

export default Ingredient;
