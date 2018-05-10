import React from 'react';
import { Link } from 'react-router-dom';

class RecipeRow extends React.Component {
  render() {
    const { name } = this.props.data;
    const linkKey = this.props.linkKey;
    return (
      <tr>
        <td>#{linkKey}</td>
        <td>
          <Link to={`/recipe/${linkKey}`}>{name}</Link>
        </td>
      </tr>
    );
  }
}

export default RecipeRow;
