import _ from 'lodash';
import React, { Component } from 'react';
import ImageBox from './ImageBox';
import { Link } from 'react-router-dom';

export default class HistoryBox extends Component {
  render() {
    const historyId = _.get(this.props, 'historyId');
    const recipeId = _.get(this.props, 'recipeId');
    const date = _.get(this.props, 'date', '');
    const remark = _.get(this.props, 'remark', '');
    const showRemark = _.get(this.props, 'showRemark', '');
    const images = _.get(this.props, 'images', []);

    return (
      <div>
        <ImageBox images={images}>
          <div className="row mt-4">
            <div className="col-sm-8">
              <p>{date}</p>
            </div>
            <div className="col-sm ml-auto">
              {historyId && (
                <Link to={`/recipe/${recipeId}/history/${historyId}`}>
                  <button className="btn btn-block">Edit</button>
                </Link>
              )}
            </div>
          </div>
          {showRemark && (
            <div className="row mt-2">
              <p>{remark}</p>
            </div>
          )}
        </ImageBox>
      </div>
    );
  }
}
