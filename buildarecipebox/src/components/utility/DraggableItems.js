import _ from 'lodash';
import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

const ItemTypes = {
  IMAGE_UPLOADER: 'imageUploader'
};

const sourceSpec = {
  beginDrag(props) {
    return {
      no: props.no
    };
  }
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const targetSpec = {
  drop(props, monitor) {
    const sourceNo = monitor.getItem() ? monitor.getItem().no : null;
    const targetNo = props.no;
    props.onSwitch(sourceNo, targetNo);
  }
};

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

const DraggableImage = _.flow([
  DragSource(ItemTypes.IMAGE_UPLOADER, sourceSpec, collectSource),
  DropTarget(ItemTypes.IMAGE_UPLOADER, targetSpec, collectTarget)
])(
  class DraggableImage extends Component {
    render() {
      const {
        connectDragSource,
        connectDropTarget,
        isDragging,
        isOver,
        canDrop
      } = this.props;

      const isDragEntering = isOver && canDrop;
      const dropEffect = isDragEntering ? 'move' : 'none';

      return connectDropTarget(
        connectDragSource(
          <div
            className={this.props.className}
            aria-grabbed={isDragging}
            aria-dropeffect={dropEffect}>
            {this.props.children}
          </div>
        )
      );
    }
  }
);

export { DraggableImage };
