import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import ImageUploader from './ImageUploader';
import { TextArea, DragDropZone } from './utility';
import {
  recipeFetch,
  reset,
  historyUpdate,
  historyAdd,
  historyDateChange,
  historyRemarkChange,
  historyEdit,
  imgUploaderAdd,
  imgUpload,
  imageDelete,
  imageSwitch
} from '../reducers/recipeReducer';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/react-datepicker.css';

const HistoryCreate = connect(store => {
  return {
    name: store.recipe.name,
    histories: store.recipe.histories,
    historyId: store.recipe.historyId,
    recipeId: store.recipe.recipeId,
    fetching: store.recipe.fetching,
    fetched: store.recipe.fetched,
    updating: store.recipe.updating,
    updated: store.recipe.updated,
    uploading: store.recipe.uploading
  };
})(
  class HistoryCreate extends Component {
    componentDidMount = () => {
      const recipeId = this.props.match.params.id;
      const historyId = this.props.match.params.historyId;

      this.props.dispatch(recipeFetch(recipeId)).then(() => {
        console.log('recipeFetch complete');
        if (historyId === 'create') {
          this.props.dispatch(historyAdd());
        } else {
          this.props.dispatch(historyEdit(historyId));
        }
      });
    };

    handleDateChange = moment => {
      const historyId = this.props.historyId;
      const date = moment.format('YYYY/MM/DD');
      this.props.dispatch(historyDateChange(date, historyId));
    };

    handleRemarkChange = e => {
      const value = e.target.value;
      const historyId = this.props.historyId;
      this.props.dispatch(historyRemarkChange(value, historyId));
    };

    handleHistoryUpdate = () => {
      const { recipeId, histories } = this.props;
      this.props.dispatch(historyUpdate(recipeId, histories));
    };

    handleImageUploaderAdd = () => {
      const { historyId } = this.props;
      this.props.dispatch(imgUploaderAdd('History', historyId));
    };

    handleImageUpload = (e, no) => {
      console.log('onImageUpload');
      const { historyId } = this.props;
      this.props.dispatch(imgUpload(e, 'History', no, historyId));
    };

    handleImageDelete = (e, no) => {
      e.preventDefault();
      const { historyId } = this.props;
      this.props.dispatch(imageDelete('History', no, historyId));
    };

    handleSwitch = (sourceNo, targetNo) => {
      const { historyId } = this.props;
      this.props.dispatch(
        imageSwitch('History', sourceNo, targetNo, historyId)
      );
    };

    render() {
      const {
        name,
        histories,
        historyId,
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

      let history;
      let index;
      if (historyId !== 0) {
        index = _.findIndex(histories, ['id', historyId]);
        if (index !== -1) {
          history = histories[index];
        }
      }

      const hasDate = !!_.get(history, 'date');
      const date = hasDate ? moment(_.get(history, 'date')) : moment();
      const remark = _.get(history, 'remark', '');
      const images = _.get(history, 'images', []);

      const imageUploaders = [];

      images &&
        images.length > 0 &&
        images.forEach(image => {
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
                onUpload={e => this.handleImageUpload(e, no)}
                onDelete={this.handleImageDelete}
                onSwitch={this.handleSwitch}
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
                <DatePicker
                  dateFormat="DD/MM/YYYY"
                  selected={date}
                  onChange={this.handleDateChange}
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
                onClick={this.handleImageUploaderAdd}>
                Add Image
              </button>
            </div>
          </div>
          <div className="row mt-5">
            <DragDropZone>{imageUploaders}</DragDropZone>
          </div>
        </div>
      );
    }
  }
);

export default HistoryCreate;
