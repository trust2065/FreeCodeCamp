import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class RecipeRow extends React.Component {
  render() {
    const { name } = this.props.data;
    const linkKey = this.props.linkKey;
    return (
      <tr>
        <td>
          <th scope="col">#{linkKey}</th>
          <td>
            <Link to={`/recipe/${linkKey}`}>{name}</Link>
          </td>
        </td>
      </tr>
    );
  }
}

export default RecipeRow;
