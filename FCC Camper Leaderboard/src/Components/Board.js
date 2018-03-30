import React from "react";
import UserRow from "./UserRow.js";
import Header from "./Header.js";
import 'datatables.net-dt/css/jquery.dataTables.css';

class Board extends React.Component {
  render() {
    let rows = [];
    const testData = this.props.testData;
    testData.forEach((data, i) => {
      rows.push(<UserRow key={i} data={data} index={i} />);
    });

    return <div className="m-2">
        <Header />
        <div className="table-responsive">
          <table id="userTable" className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Recent 30 days</th>
                <th scope="col">All time</th>
                <th scope="col">Img</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>;
  }
}

export default Board;
