import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';
import { Ingredient, Step } from './components';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  imgUpload,
  ingredientAdd,
  ingredientChange,
  ingredientDelete,
  nameChange,
  stepAdd,
  stepChange,
  stepDelete,
  recipeFetch,
  recipeUpdate,
  reset
} from './reducer';

// let recipeId;
const Recipe = connect(store => {
  const { recipeId, steps, ingredients, name, imgURL } = store.recipe.data;
  const { fetching, fetched, updating, updated, uploading } = store.recipe.meta;
  return {
    recipeId,
    steps,
    ingredients,
    name,
    imgURL,
    fetching,
    fetched,
    updating,
    updated,
    uploading
  };
})(
  class Recipe extends Component {
    componentDidMount() {
      const recipeId = this.props.match.params.id;
      // console.log('recipe id: ' + recipeId);
      this.props.dispatch(recipeFetch(recipeId));
    }

    handleAddIngredient = () => {
      this.props.dispatch(ingredientAdd());
    };

    handleAddStep = () => {
      this.props.dispatch(stepAdd());
    };

    handleUpdateRecipe = () => {
      const { recipeId, name, steps, ingredients, imgURL } = this.props;
      this.props.dispatch(
        recipeUpdate(recipeId, name, ingredients, steps, imgURL)
      );
    };

    handleIngredientChange = (e, i) => {
      const changedText = e.target.value;
      this.props.dispatch(ingredientChange(i, changedText));
    };

    handleStepChange = (e, i) => {
      const changedText = e.target.value;
      this.props.dispatch(stepChange(i, changedText));
    };

    handleNameChange = e => {
      this.props.dispatch(nameChange(e.target.value));
    };

    handleStepDelete = i => {
      this.props.dispatch(stepDelete(i));
    };

    handleIngredientDelete = i => {
      // console.log('delete: ' + i);
      this.props.dispatch(ingredientDelete(i));
    };

    handleImageUpload = e => {
      this.props.dispatch(imgUpload(e));
    };

    render() {
      // console.log('render Recipe');
      // console.log(this.props);
      const {
        name,
        fetching,
        updating,
        updated,
        uploading,
        recipeId,
        imgURL
      } = this.props;

      const ingredients = _.get(this.props, 'ingredients', []);
      const steps = _.get(this.props, 'steps', []);

      let ingredientsRow = [];
      let stepsRow = [];

      ingredientsRow = ingredients.map((ingredient, i) => (
        <Ingredient
          key={`ingredient_${i}`}
          onChange={e => this.handleIngredientChange(e, i)}
          onDelete={() => this.handleIngredientDelete(i)}
          name={ingredient.name}
        />
      ));

      stepsRow = steps.map((step, i) => (
        <Step
          key={`step_${i}`}
          desp={step.desp}
          step={i + 1}
          onChange={e => this.handleStepChange(e, i)}
          onDelete={() => this.handleStepDelete(i)}
        />
      ));

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

      return (
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <div className="contents">
                <div className="d-flex justify-content-between">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={this.handleNameChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="id">Id</label>
                    <input
                      type="text"
                      className="form-control"
                      id="id"
                      value={recipeId}
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group">
                  <p>Ingredients</p>
                  {ingredientsRow}
                  <button
                    className="btn btn-block"
                    onClick={this.handleAddIngredient}>
                    Add
                  </button>
                </div>
                <div className="form-group">
                  <p>Steps</p>
                  {stepsRow}
                  <button
                    className="btn btn-block"
                    onClick={this.handleAddStep}>
                    Add
                  </button>
                </div>
              </div>
              <div className="ctrlBtns">
                <button
                  disabled={toggleDisable}
                  className={`btn btn-block ${styleBtnUpdateText}`}
                  onClick={this.handleUpdateRecipe}>
                  {btnUpdateText}
                </button>
              </div>
            </div>
            <div className="col-sm">
              {recipeId && (
                <div>
                  <Link to={`/recipe/${recipeId}/history`}>
                    <button className="btn btn-block mb-4">View History</button>
                  </Link>
                  <Link to={`/recipe/${recipeId}/history/create`}>
                    <button className="btn btn-block mb-4">Add History</button>
                  </Link>
                </div>
              )}
              <form id="imgur">
                {uploading ? (
                  <label>Uploading</label>
                ) : (
                  <label
                    htmlFor="inputRecipeImg"
                    type="button"
                    className="btn btn-block">
                    Select Image
                  </label>
                )}
                <input
                  style={{ display: 'none' }}
                  id="inputRecipeImg"
                  type="file"
                  accept="image/*"
                  data-max-size="5000"
                  onChange={this.handleImageUpload}
                />
              </form>
              {!imgURL ||
                (imgURL !== '' && (
                  <div className="d-flex align-items-center justify-content-center">
                    <img className="img-fluid" src={imgURL} alt="img" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
    }
  }
);
export default Recipe;
