import React, { Component } from 'react';
import styled from 'styled-components';
import IconTrash from 'react-icons/lib/fa/trash';
import { DraggableImage } from './';
class ImageUploader extends Component {
  render() {
    const { no, onUpload, onDelete, onSwitch, url, uploading } = this.props;

    return (
      <div>
        <form id="formImage">
          {uploading ? (
            <label className="btn btn-block mt-2 mb-2">Uploading</label>
          ) : (
            <div className="d-flex justify-content-between mt-2 mb-2">
              <StyledLabel
                htmlFor={`image_${no}`}
                type="button"
                className="btn">
                Select Image
              </StyledLabel>
              <StyledButton className="btn ml-2" onClick={e => onDelete(e, no)}>
                <IconTrash />
              </StyledButton>
            </div>
          )}
          <input
            type="file"
            id={`image_${no}`}
            style={{ display: 'none' }}
            accept="image/*"
            data-max-size="5000"
            onChange={onUpload}
          />
        </form>
        {!url ||
          (url !== '' && (
            <DraggableImage no={no} onSwitch={onSwitch}>
              <img className="img-fluid" src={url} alt="img" />
            </DraggableImage>
          ))}
      </div>
    );
  }
}

const StyledLabel = styled.label`
  flex: 3;
  margin: 0;
`;
const StyledButton = styled.button`
  flex: 1;
`;

export default ImageUploader;
