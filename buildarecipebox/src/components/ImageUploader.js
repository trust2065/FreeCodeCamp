import React, { Component } from 'react';

class ImageUploader extends Component {
  render() {
    const { no, onImageUpload, url, disabled, uploading } = this.props;

    return (
      <div>
        <form id="formImage">
          {uploading ? (
            <label className="btn btn-block mt-2">Uploading</label>
          ) : (
            <label
              htmlFor={`image_${no}`}
              type="button"
              className="btn btn-block mt-2">
              Select Image
            </label>
          )}
          <input
            disabled={disabled}
            type="file"
            id={`image_${no}`}
            style={{ display: 'none' }}
            accept="image/*"
            data-max-size="5000"
            onChange={onImageUpload}
          />
        </form>
        {!url ||
          (url !== '' && <img className="img-fluid" src={url} alt="img" />)}
      </div>
    );
  }
}

export default ImageUploader;
