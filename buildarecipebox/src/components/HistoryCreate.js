import React, { Component } from 'react';
import ImageUploader from './ImageUploader';
import { TextArea } from './utility';
import { connect } from 'react-redux';
import { imgUploaderAdd, imgUpload } from '../reducers/recipeReducer';

const HistoryCreate = connect(store => {
  return {
    recipeId: store.recipe.recipeId,
    imgURLHistory: store.recipe.imgURLHistory
  };
})(
  class HistoryCreate extends Component {
    constructor(props) {
      super(props);
      this.onAddImageUploader = this.onAddImageUploader.bind(this);
      this.onImageUpload = this.onImageUpload.bind(this);
    }
    onNameChange() {}
    onDateChange() {}
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
      const { imgURLHistory } = this.props;
      const { name, date, remark } = {
        name: '',
        date: '',
        remark: ''
      };

      // const imgURLHistory = [
      //   { no: 1, url: '' },
      //   { no: 2, url: '' },
      //   { no: 3, url: '' },
      //   { no: 4, url: '' }
      // ];
      const imageUploaders = [];

      imgURLHistory &&
        imgURLHistory.forEach(image => {
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
                  type="text"
                  value={name}
                  onChange={this.onNameChange}
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
