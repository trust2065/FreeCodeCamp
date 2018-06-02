import React, { Component } from 'react';
import ImageUploader from './ImageUploader';
import { TextArea } from './utility';
import { connect } from 'react-redux';
import {
  recipeFetch,
  reset,
  historyUpdate,
  historyDateChange,
  historyRemarkChange,
  imgUploaderAdd,
  imgUpload
} from '../reducers/recipeReducer';

const HistoryCreate = connect(store => {
  return {
    name: store.recipe.name,
    history: store.recipe.history,
    recipeId: store.recipe.recipeId,
    fetching: store.recipe.fetching,
    fetched: store.recipe.fetched,
    updating: store.recipe.updating,
    updated: store.recipe.updated,
    uploading: store.recipe.uploading
  };
})(
  class HistoryCreate extends Component {
    // constructor(props) {
    //   super(props);
    //   this.onAddImageUploader = this.handleAddImageUploader.bind(this);
    //   this.onImageUpload = this.handleImageUpload.bind(this);
    //   this.onDateChange = this.handleDateChange.bind(this);
    //   this.onRemarkChange = this.handleRemarkChange.bind(this);
    //   this.onHistoryUpdate = this.handleHistoryUpdate.bind(this);
    // }

    componentDidMount = () => {
      const recipeId = this.props.match.params.id;
      this.props.dispatch(recipeFetch(recipeId));
    };

    handleDateChange = e => {
      const value = e.target.value;
      this.props.dispatch(historyDateChange(value));
    };

    handleRemarkChange = e => {
      const value = e.target.value;
      this.props.dispatch(historyRemarkChange(value));
    };

    handleHistoryUpdate = () => {
      const { recipeId } = this.props;
      const history = this.props.history;
      this.props.dispatch(historyUpdate(recipeId, history));
    };

    handleAddImageUploader = () => {
      this.props.dispatch(imgUploaderAdd('History'));
    };

    handleImageUpload = (e, no) => {
      console.log('onImageUpload');
      this.props.dispatch(imgUpload(e, 'History', no));
    };

    render() {
      const {
        name,
        history,
        fetching,
        updating,
        updated,
        uploading
      } = this.props;

      let styleBtnUpdateText;
      let toggleDisable = false;
      let btnUpdateText;

      if (fetching || updating || uploading) {
        if (fetching) {
          btnUpdateText = 'fetching';
        } else if (updating) {
          btnUpdateText = 'updating';
        } else if (uploading) {
          btnUpdateText = 'image uploading';
        }
        toggleDisable = true;
        styleBtnUpdateText = 'btn-warning disable';
      } else if (updated) {
        btnUpdateText = 'update complete';
        toggleDisable = true;
        styleBtnUpdateText = 'btn-success disable';
        setTimeout(() => {
          this.props.dispatch(reset());
        }, 2000);
      } else {
        btnUpdateText = 'update';
        styleBtnUpdateText = 'btn-primary';
      }

      const latestHistory = history[history.length - 1];
      const { date, remark, image } = latestHistory;

      const imageUploaders = [];

      image &&
        image.length > 0 &&
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
                disabled={toggleDisable}
                uploading={uploading}
                onImageUpload={e => this.handleImageUpload(e, no)}
              />
            </div>
          );
        });

      return (
        <div className="container">
          <div className="row">
            <div className="col-sm-4 ml-auto">
              <button
                disabled={toggleDisable}
                className={`btn btn-block ${styleBtnUpdateText}`}
                onClick={this.handleHistoryUpdate}>
                {btnUpdateText}
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
                  onChange={this.handleDateChange}
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
                  onChange={this.handleRemarkChange}>
                  />
                </TextArea>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4 mr-auto">
              <button
                className="btn bnt-block"
                onClick={this.handleAddImageUploader}>
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
