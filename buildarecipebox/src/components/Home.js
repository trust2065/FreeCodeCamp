import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RecipeDao from './RecipeDao';
import RecipeRow from './RecipeRow';
import '../css/Home.css';
import $ from 'jquery';
import 'datatables.net';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let rows = [];
    RecipeDao.getList(snapshot => {
      snapshot.forEach(child => {
        let key = child.key;
        let recipe = child.val();
        // console.log(recipe);
        rows.push(<RecipeRow key={key} data={recipe} linkKey={key} />);
      });

      this.setState({ rows: rows });
      $('#recipeTable').DataTable({
        columnDefs: [{ width: '10%', targets: 0 }]
      });
    });
  }

  render() {
    return (
      <div className="container">
        <div className="recipeActions">
          <Link to="/recipe/new">
            <button>Create Recipe</button>
          </Link>
        </div>
        <div className="table-responsive">
          <table id="recipeTable" className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>{this.state.rows}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Home;
