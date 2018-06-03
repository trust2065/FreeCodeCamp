import React, { Component } from 'react';
import ImageBox from './utility/ImageBox';
import { recipeFetch } from '../reducers/recipeReducer';
import { connect } from 'react-redux';

const HistoryDetail = connect(store => ({
  histories: store.recipe.histories
}))(
  class HistoryDetail extends Component {
    componentDidMount = () => {
      const recipeId = this.props.match.params.id;
      this.props.dispatch(recipeFetch(recipeId));
    };
    render() {
      return <div>HistoryDetail</div>;
    }
  }
);

export default HistoryDetail;
