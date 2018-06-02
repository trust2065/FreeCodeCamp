import React, { Component } from 'react';
import { connect } from 'react-redux';

const ImageUploader = connect(store => {
  return {};
})(
  class ImageUploader extends Component {
    render() {
      const { no, onImageUpload, url } = this.props;

      return (
        <div>
          <form id="formImage">
            <label
              htmlFor={`image_${no}`}
              type="button"
              className="btn btn-block mt-2">
              Select Image
            </label>
            <input
              type="file"
              id={`image_${no}`}
              style={{ display: 'none' }}
              accept="image/"
              data-max-size="5000"
              onChange={onImageUpload}
            />
          </form>
          <img src={url} alt="" />
        </div>
      );
    }
  }
);

export default ImageUploader;
