import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import '../include/bootstrap'

class UserRow extends React.Component {
  render() {
    const {username, img, recent, alltime} = this.props.data;
    const index = this.props.index;
    return <tr>
        <th scope="row">{index + 1}</th>
        <td>{username}</td>
        <td>{recent}</td>
        <td>{alltime}</td>
        <td className="text-right">
          <img className="img-fluid" src={img} alt={username+"'s img"} />
        </td>
      </tr>
  }
}

export default UserRow;
