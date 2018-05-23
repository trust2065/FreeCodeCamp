import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Ingredient from './Ingredient.js';
import Step from './Step.js';
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
  Reset
} from '../reducers/recipeReducer';

// let recipeId;
const Recipe = connect(store => {
  return {
    recipeId: store.recipe.recipeId,
    steps: store.recipe.steps,
    ingredients: store.recipe.ingredients,
    name: store.recipe.name,
    fetching: store.recipe.fetching,
    fetched: store.recipe.fetched,
    updating: store.recipe.updating,
    updated: store.recipe.updated,
    uploading: store.recipe.uploading,
    imgURL: store.recipe.imgURL
  };
})(
  class Recipe extends Component {
    constructor(props) {
      super(props);

      this.onAddIngredient = this.onAddIngredient.bind(this);
      this.onAddStep = this.onAddStep.bind(this);
      this.onUpdateRecipe = this.onUpdateRecipe.bind(this);
      this.onImageUpload = this.onImageUpload.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleIngredientChange = this.handleIngredientChange.bind(this);
      this.handleStepChange = this.handleStepChange.bind(this);
    }

    componentDidMount() {
      const recipeId = this.props.match.params.id;
      // console.log('recipe id: ' + recipeId);
      this.props.dispatch(recipeFetch(recipeId));
    }

    onAddIngredient() {
      this.props.dispatch(ingredientAdd());
    }

    onAddStep() {
      this.props.dispatch(stepAdd());
    }

    onUpdateRecipe() {
      const { recipeId, name, steps, ingredients, imgURL } = this.props;
      this.props.dispatch(
        recipeUpdate(recipeId, name, ingredients, steps, imgURL)
      );
    }

    handleIngredientChange(e, i) {
      const changedText = e.target.value;
      this.props.dispatch(ingredientChange(i, changedText));
    }

    handleStepChange(e, i) {
      const changedText = e.target.value;
      this.props.dispatch(stepChange(i, changedText));
    }

    handleNameChange(e) {
      this.props.dispatch(nameChange(e.target.value));
    }

    handleStepDelete(i) {
      this.props.dispatch(stepDelete(i));
    }

    handleIngredientDelete(i) {
      // console.log('delete: ' + i);
      this.props.dispatch(ingredientDelete(i));
    }

    onImageUpload(e) {
      this.props.dispatch(imgUpload(e));
    }

    render() {
      // console.log('render Recipe');
      // console.log(this.props);
      const {
        ingredients,
        steps,
        name,
        fetching,
        updating,
        updated,
        uploading,
        recipeId,
        imgURL
      } = this.props;

      let ingredientsRow = [];
      let stepsRow = [];
      if (ingredients && ingredients.length > 0) {
        ingredients.forEach((element, i) => {
          ingredientsRow.push(
            <Ingredient
              key={`ingredient_${i}`}
              onChange={e => this.handleIngredientChange(e, i)}
              onDelete={() => this.handleIngredientDelete(i)}
              name={element.name}
            />
          );
        });
      }
      if (steps && steps.length > 0) {
        steps.forEach((element, i) => {
          stepsRow.push(
            <Step
              key={`step_${i}`}
              desp={element.desp}
              onChange={e => this.handleStepChange(e, i)}
              onDelete={() => this.handleStepDelete(i)}
              step={element.step}
            />
          );
        });
      }

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
          this.props.dispatch(Reset());
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
                    onClick={this.onAddIngredient}>
                    Add
                  </button>
                </div>
                <div className="form-group">
                  <p>Steps</p>
                  {stepsRow}
                  <button className="btn btn-block" onClick={this.onAddStep}>
                    Add
                  </button>
                </div>
              </div>
              <div className="ctrlBtns">
                <button
                  disabled={toggleDisable}
                  className={`btn btn-block ${styleBtnUpdateText}`}
                  onClick={this.onUpdateRecipe}>
                  {btnUpdateText}
                </button>
              </div>
            </div>
            <div className="col-sm">
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
                  onChange={this.onImageUpload}
                />
              </form>
              {!imgURL ||
                (imgURL !== '' && (
                  <img className="img-fluid" src={imgURL} alt="img" />
                ))}
            </div>
          </div>
        </div>
      );
    }
  }
);
export default Recipe;
