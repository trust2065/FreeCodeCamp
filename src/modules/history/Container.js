import _ from 'lodash';
import React, { Component } from 'react';
import { HistoryBox } from '../../components';
import { recipeFetch } from './reducer';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const History = connect(store => {
  const { histories, recipeId, name } = store.history.data;
  return {
    histories,
    recipeId,
    name
  };
})(
  class History extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showRemark: true
      };
    }
    componentDidMount = () => {
      const recipeId = _.get(this.props, 'match.params.id', '');
      this.props.dispatch(recipeFetch(recipeId));
    };
    onShowRemarkChange = e => {
      const showRemark = e.target.checked;
      this.setState({ ...this.state, showRemark: showRemark });
    };
    render() {
      const histories = _.get(this.props, 'histories', []);
      const recipeId = _.get(this.props, 'recipeId', 0);
      const name = _.get(this.props, 'name', '');
      const showRemark = _.get(this.state, 'showRemark', true);

      const historyBoxes = [];

      histories &&
        histories.forEach((history, i) => {
          historyBoxes.push(
            <div key={`historyImage_${i}`} className="col-sm-4">
              <HistoryBox
                recipeId={recipeId}
                historyId={history.id}
                images={history.images}
                remark={history.remark}
                date={history.date}
                showRemark={showRemark}
              />
            </div>
          );
        });

      return (
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  disabled
                  type="text"
                  value={name}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-sm-4 ml-auto">
              <div className="form-check float-right">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showRemark"
                  onChange={this.onShowRemarkChange}
                  checked={showRemark}
                />
                <label className="form-check-label" htmlFor="showRemark">
                  Show remark
                </label>
              </div>
              {recipeId && (
                <Link to={`/recipe/${recipeId}/history/create`}>
                  <button className="btn btn-block mt-5">Add History</button>
                </Link>
              )}
            </div>
          </div>
          <div className="row mt-5">{historyBoxes}</div>
        </div>
      );
    }
  }
);

export default History;
