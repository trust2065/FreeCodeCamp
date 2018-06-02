import React, { Component } from 'react';
import ImageUploader from './ImageUploader';
import { TextArea } from './utility';
import { connect } from 'react-redux';
import {
  historyAdd,
  imgUploaderAdd,
  imgUpload
} from '../reducers/recipeReducer';

const HistoryCreate = connect(store => {
  return {
    name: store.recipe.name,
    history: store.recipe.history,
    recipeId: store.recipe.recipeId
  };
})(
  class HistoryCreate extends Component {
    constructor(props) {
      super(props);
      this.onAddImageUploader = this.onAddImageUploader.bind(this);
      this.onImageUpload = this.onImageUpload.bind(this);
    }

    componentDidMount() {
      const recipeId = this.props.match.params.id;
      this.props.dispatch(recipeFetch(recipeId));
    }

    onRemarkChange(e) {}

    onUpdateRecipeHistory() {}

    onAddImageUploader() {
      this.props.dispatch(imgUploaderAdd('History'));
    }

    onImageUpload(e, no) {
      console.log('onImageUpload');
      this.props.dispatch(imgUpload(e, 'History', no));
    }

    render() {
      const { name } = this.props;
      const latestHistory = this.props.history[this.props.history.length - 1];
      const { date, remark, image } = latestHistory;

      const imageUploaders = [];

      image.forEach(image => {
        const no = image.no;
        const url = image.url;
        imageUploaders.push(
          <div
            key={`imageUploader_${no}`}
            className="col-sm-4"
            style={{ minHeight: '15vw' }}>
            <ImageUploader
              no={no}
              url={url}
              onImageUpload={e => this.onImageUpload(e, no)}
            />
          </div>
        );
      });

      return (
        <div className="container">
          <div className="row">
            <div className="col-sm-4 ml-auto">
              <button
                className="btn btn-block"
                onClick={this.onUpdateRecipeHistory}>
                Save
              </button>
            </div>
          </div>
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
              <div>
                <label htmlFor="date">Date</label>
                <input
                  type="text"
                  value={date}
                  onChange={this.onDateChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mt-2">
                <label htmlFor="remark">Remark</label>
                <TextArea
                  className="form-control"
                  rows="5"
                  id="comment"
                  value={remark}
                  onChange={this.onRemarkChange}>
                  />
                </TextArea>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4 mr-auto">
              <button
                className="btn bnt-block"
                onClick={this.onAddImageUploader}>
                Add Image
              </button>
            </div>
          </div>
          <div className="row mt-5">{imageUploaders}</div>
        </div>
      );
    }
  }
);

export default HistoryCreate;
