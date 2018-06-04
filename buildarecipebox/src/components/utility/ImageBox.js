import React, { Component } from 'react';

export default class ImageBox extends Component {
  constructor(props) {
    super(props);
    this.state = { imageIndex: 0 };
    this.imageMoves = {
      left: 'LEFT',
      right: 'RIGHT'
    };
    this.defaultImageURL = 'https://i.imgur.com/ZyWrMfd.png';
  }
  getImageUrl = imageIndex => {
    const { images } = this.props;

    let url = this.defaultImageURL;

    if (images && images.length > 0) {
      if (images[imageIndex].url !== '') {
        url = images[imageIndex].url;
      }
    }
    return url;
  };
  onImageIndexChange = move => {
    const imageIndex = this.state.imageIndex;

    if (this.hasImage(move, imageIndex)) {
      const newImageIndex = this.getNewImageIndex(move, imageIndex);
      this.setState({ imageIndex: newImageIndex });
    }
  };

  getNewImageIndex = (move, imageIndex) => {
    const { left, right } = this.imageMoves;

    let moveIndex = 0;

    if (move === left) {
      moveIndex = -1;
    } else if (move === right) {
      moveIndex = 1;
    }

    return imageIndex + moveIndex;
  };

  hasImage(move, imageIndex) {
    const { images } = this.props;

    if (!images) {
      return false;
    }
    const imageLastIndex = images.length - 1;
    const newImageIndex = this.getNewImageIndex(move, imageIndex);

    if (newImageIndex >= 0 && newImageIndex <= imageLastIndex) {
      return true;
    }
    return false;
  }

  render() {
    const { left, right } = this.imageMoves;
    const { imageIndex } = this.state;
    const url = this.getImageUrl(imageIndex);
    const hasLeftImage = this.hasImage(left, imageIndex);
    const hasRightImage = this.hasImage(right, imageIndex);

    return (
      <div className="container-fluid">
        <div className="row">
          <button
            disabled={!hasLeftImage}
            className="btn mr-auto"
            onClick={() => this.onImageIndexChange(left)}>
            &#8592;
          </button>
          <button
            disabled={!hasRightImage}
            className="btn ml-auto"
            onClick={() => this.onImageIndexChange(right)}>
            &#8594;
          </button>
        </div>
        <div className="row mt-2">
          <div>
            <img className="img-fluid" src={url} alt="record" />
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
