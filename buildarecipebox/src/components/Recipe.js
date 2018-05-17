import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ingredient from './Ingredient.js';
import Step from './Step.js';
import { connect } from 'react-redux';
import {
  FETCH_RECIPE,
  NAME_CHANGE,
  INGREDIENT_CHANGE,
  STEP_CHANGE,
  UPDATE_RECIPE,
  RESET,
  STEP_ADD,
  INGREDIENT_ADD,
  STEP_DELETE
} from '../actions/recipeActions';

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
    updated: store.recipe.updated
  };
})(
  class Recipe extends Component {
    constructor(props) {
      super(props);

      this.onAddIngredient = this.onAddIngredient.bind(this);
      this.onAddStep = this.onAddStep.bind(this);
      this.onUpdateRecipe = this.onUpdateRecipe.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleIngredientChange = this.handleIngredientChange.bind(this);
      this.handleStepChange = this.handleStepChange.bind(this);
    }
    componentDidMount() {
      const recipeId = this.props.match.params.id;
      // console.log('recipe id: ' + recipeId);
      this.props.dispatch(FETCH_RECIPE(recipeId));
    }

    onAddIngredient() {
      this.props.dispatch(INGREDIENT_ADD());
    }
    onAddStep() {
      this.props.dispatch(STEP_ADD());
    }
    onUpdateRecipe() {
      const { recipeId, name, steps, ingredients } = this.props;
      this.props.dispatch(UPDATE_RECIPE(recipeId, name, ingredients, steps));
    }

    handleIngredientChange(e, i) {
      const changedText = e.target.value;
      this.props.dispatch(INGREDIENT_CHANGE(i, changedText));
    }

    handleStepChange(e, i) {
      const changedText = e.target.value;
      this.props.dispatch(STEP_CHANGE(i, changedText));
    }

    handleNameChange(e) {
      this.props.dispatch(NAME_CHANGE(e.target.value));
    }

    handleStepDelete(i) {
      // console.log('delete: ' + i);
      this.props.dispatch(STEP_DELETE(i));
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
        recipeId
      } = this.props;

      let ingredientsRow = [];
      let stepsRow = [];
      if (ingredients && ingredients.length > 0) {
        ingredients.forEach((element, i) => {
          ingredientsRow.push(
            <Ingredient
              key={`ingredient_${i}`}
              onChange={e => this.handleIngredientChange(e, i)}
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

      if (fetching || updating) {
        if (fetching) {
          btnUpdateText = 'fetching';
        } else if (updating) {
          btnUpdateText = 'updating';
        }
        toggleDisable = true;
        styleBtnUpdateText = 'btn-warning disable';
      } else if (updated) {
        btnUpdateText = 'update complete';
        toggleDisable = true;
        styleBtnUpdateText = 'btn-success disable';
        setTimeout(() => {
          this.props.dispatch(RESET());
        }, 2000);
      } else {
        btnUpdateText = 'update';
        styleBtnUpdateText = 'btn-primary';
      }

      return (
        <div className="container">
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
              <button className="btn btn-block" onClick={this.onAddIngredient}>
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
      );
    }
  }
);
export default Recipe;
