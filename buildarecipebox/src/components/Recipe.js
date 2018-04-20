import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

class Recipe extends Component {
  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="contents">
            <div className="d-flex justify-content-between">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name" />
              </div>
              <div className="form-group">
                <label htmlFor="id">Id</label>
                <input type="text" className="form-control" id="id" />
              </div>
            </div>
            <div className="form-group">
              <p>Ingredients</p>
              <div>
                <input type="text" className="form-control" />
                <input type="text" className="form-control" />
                <input type="text" className="form-control" />
              </div>
            </div>
            <div className="form-group">
              <p>Steps</p>
              <div>
                <input type="text" className="form-control" />
                <input type="text" className="form-control" />
                <input type="text" className="form-control" />
              </div>
            </div>
          </div>
          <div className="ctrlBtns">
            <button className="btn">Update</button>
          </div>
        </div>
      </div>
      );
  }
}

export default Recipe;
