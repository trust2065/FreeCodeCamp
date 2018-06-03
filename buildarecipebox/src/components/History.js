import _ from 'lodash';
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
      const historyId = parseInt(this.props.match.params.historyId, 10);

      this.props.dispatch(recipeFetch(recipeId));
    };
    render() {
      const { histories } = this.props;

      const imageBoxs = [];

      histories.forEach((history, i) => {
        let presentUrl = 'https://i.imgur.com/ZyWrMfd.png';
        if (history.images && history.images.length > 0) {
          if (history.images[0].url !== '') {
            presentUrl = history.images[0].url;
          }
        }
        imageBoxs.push(
          <div
            key={`historyImage_${i}`}
            className="col-sm-4"
            style={{ minHeight: '15vw' }}>
            <HistoryBox
              url={presentUrl}
              remark={history.remark}
              date={history.date}
              showRemark={true}
            />
          </div>
        );
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
          <div className="row mt-5">{imageBoxs}</div>
        </div>
      );
    }
  }
);

export default History;
