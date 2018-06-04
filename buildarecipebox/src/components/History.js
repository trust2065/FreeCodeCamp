import React, { Component } from 'react';
import HistoryBox from './utility/HistoryBox';
import { recipeFetch } from '../reducers/recipeReducer';
import { connect } from 'react-redux';

const History = connect(store => ({
  histories: store.recipe.histories
}))(
  class History extends Component {
    constructor(props) {
      super(props);
      this.state = {
        history: { date: '', remark: '', images: [] },
        historyId: 0
      };
    }
    componentDidMount = () => {
      const recipeId = this.props.match.params.id;
      this.props.dispatch(recipeFetch(recipeId));
    };
    render() {
      const { histories } = this.props;

      const historyBoxs = [];

      histories.forEach((history, i) => {
        historyBoxs.push(
          <div key={`historyImage_${i}`} className="col-sm-4">
            <HistoryBox
              images={history.images}
              remark={history.remark}
              date={history.date}
              showRemark={true}
            />
          </div>
        );
        if (i !== 0 && i % 3 === 0) {
          historyBoxs.push(<div className="clearfix" />);
        }
      });

      return (
        <div className="container">
          <div className="row">
            <div className="col-sm-4 ml-auto">
              <div className="form-check float-right">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showRemark"
                />
                <label className="form-check-label" htmlFor="showRemark">
                  Show remark
                </label>
              </div>
              <button className="btn btn-block mt-5">Add History</button>
            </div>
          </div>
          <div className="row mt-5">{historyBoxs}</div>
        </div>
      );
    }
  }
);

export default History;
