import _ from 'lodash';
import React, { Component } from 'react';
import ImageBox from './ImageBox';

export default class HistoryBox extends Component {
  render() {
    const date = _.get(this.props, 'date', '');
    const remark = _.get(this.props, 'remark', '');
    const showRemark = _.get(this.props, 'showRemark', '');
    const images = _.get(this.props, 'images', []);

    return (
      <ImageBox images={images}>
        <div className="row">
          <p>{date}</p>
        </div>
        {showRemark && (
          <div className="row">
            <p>{remark}</p>
          </div>
        )}
      </ImageBox>
    );
  }
}
