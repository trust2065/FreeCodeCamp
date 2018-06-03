import React, { Component } from 'react';

export default class HistoryBox extends Component {
  render() {
    const { url, date, remark, showRemark } = this.props;
    return (
      <div className="container-fluid">
        <div className="row">
          <img className="img-fluid" src={url} alt="record" />
        </div>
        <div className="row">
          <p>{date}</p>
        </div>
        {showRemark && (
          <div className="row">
            <p>{remark}</p>
          </div>
        )}
      </div>
    );
  }
}
