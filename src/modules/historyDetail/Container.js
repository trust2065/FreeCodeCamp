import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import {
  TextArea,
  DragDropZone,
  ImageUploader,
  LoadingIndicator
} from '../../components';
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
} from './reducer';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../core/react-datepicker.css';
import { FaSave, FaPlus } from 'react-icons/fa';

const HistoryCreate = connect(store => {
  const { name, histories, historyId } = store.historyDetail.data;
  const {
    fetching,
    fetched,
    updating,
    updated,
    uploadingImgIndexes
  } = store.historyDetail.meta;
  return {
    name,
    historyId,
    histories,
    fetching,
    fetched,
    updating,
    updated,
    uploadingImgIndexes
  };
})(
  class HistoryCreate extends Component {
    constructor(props) {
      super(props);
      this.recipeId = _.get(this.props, 'match.params.id', 0);
    }
    componentDidMount = () => {
      const recipeId = this.recipeId;
      const historyId = _.get(this.props, 'match.params.historyId', 0);

      this.props.dispatch(recipeFetch(recipeId)).then(() => {
        if (historyId === 'create') {
          this.props.dispatch(historyAdd());
        } else {
          this.props.dispatch(historyEdit(historyId));
        }
      });
    };

    handleDateChange = moment => {
      const { historyId } = this.props;
      const date = moment.format('YYYY/MM/DD');
      this.props.dispatch(historyDateChange(date, historyId));
    };

    handleRemarkChange = e => {
      const value = e.target.value;
      const { historyId } = this.props;
      this.props.dispatch(historyRemarkChange(value, historyId));
    };

    handleHistoryUpdate = () => {
      const recipeId = this.recipeId;
      const { histories } = this.props;
      this.props.dispatch(historyUpdate(recipeId, histories));
    };

    handleImageUploaderAdd = () => {
      const { historyId } = this.props;
      this.props.dispatch(imgUploaderAdd(historyId));
    };

    handleImageUpload = (e, imgIndex) => {
      console.log('onImageUpload');
      const { historyId } = this.props;
      this.props.dispatch(imgUpload(e, imgIndex, historyId));
    };

    handleImageDelete = (e, imgIndex) => {
      e.preventDefault();
      const { historyId } = this.props;
      this.props.dispatch(imageDelete(imgIndex, historyId));
    };

    handleSwitch = (sourceImgIndex, targetImgIndex) => {
      const { historyId } = this.props;
      this.props.dispatch(
        imageSwitch(sourceImgIndex, targetImgIndex, historyId)
      );
    };

    render() {
      const name = _.get(this.props, 'name', '');
      const histories = _.get(this.props, 'histories', []);
      const historyId = _.get(this.props, 'historyId', 0);
      const fetching = _.get(this.props, 'fetching', false);
      const updating = _.get(this.props, 'updating', false);
      const updated = _.get(this.props, 'updated', false);

      const uploadingImgIndexes = _.get(this.props, 'uploadingImgIndexes', {});
      const hasImageUploading = !_.isEqual(uploadingImgIndexes, {});

      let styleBtnUpdateText;
      let toggleDisable = false;
      let btnUpdateText;

      let history;
      let index;
      if (historyId !== 0) {
        index = _.findIndex(histories, ['id', historyId]);
        if (index !== -1) {
          history = histories[index];
        }
      }

      if (fetching || updating || hasImageUploading) {
        if (fetching) {
          btnUpdateText = 'Fetching';
        } else if (updating) {
          btnUpdateText = 'Updating';
        } else if (hasImageUploading) {
          btnUpdateText = 'Image Uploading';
        }
        toggleDisable = true;
        styleBtnUpdateText = 'btn-warning disable';
      } else if (updated) {
        btnUpdateText = 'Save Complete';
        toggleDisable = true;
        styleBtnUpdateText = 'btn-success disable';
        setTimeout(() => {
          this.props.dispatch(reset());
        }, 2000);
      } else {
        btnUpdateText = 'Save';
        styleBtnUpdateText = 'btn-origin';
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
          const imgIndex = _.findIndex(images, ['no', no]);
          const url = image.url;
          imageUploaders.push(
            <div key={`imageUploader_${no}`} className="col-sm-4">
              <ImageUploader
                imgIndex={imgIndex}
                url={url}
                uploading={uploadingImgIndexes[imgIndex]}
                onUpload={e => this.handleImageUpload(e, imgIndex)}
                onDelete={this.handleImageDelete}
                onSwitch={this.handleSwitch}
              />
            </div>
          );
        });

      return fetching ? (
        <LoadingIndicator />
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="d-flex justify-content-between">
                <h2>{name}</h2>
                <button
                  disabled={toggleDisable}
                  style={{ maxWidth: '160px' }}
                  className={`btn btn-block ${styleBtnUpdateText}`}
                  onClick={this.handleHistoryUpdate}>
                  <FaSave /> {btnUpdateText}
                </button>
              </div>
              <hr />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-sm-6">
              <div>
                <h4 htmlFor="date">Date</h4>
                <DatePicker
                  dateFormat="DD/MM/YYYY"
                  selected={date}
                  onChange={this.handleDateChange}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="mt-2">
                <h4 htmlFor="remark">Remark</h4>
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
                <FaPlus /> Image
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
