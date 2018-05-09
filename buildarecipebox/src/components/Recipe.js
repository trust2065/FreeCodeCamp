import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ingredient from './Ingredient.js';
import Step from './Step.js';
import RecipeDao from './RecipeDao.js';

let recipeId;
class Recipe extends Component {
  constructor(props) {
    super(props);

    recipeId = this.props.match.params.id;
    console.log('recipe id: ' + recipeId);

    let data = { name: '', ingredients: [], steps: [] };
    this.state = { recipeId: recipeId, data: data, updateStatus: 0 };

    this.onAddIngredient = this.onAddIngredient.bind(this);
    this.onAddStep = this.onAddStep.bind(this);
    this.onUpdateRecipe = this.onUpdateRecipe.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIngredientChange = this.handleIngredientChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
  }

  componentDidMount() {
    RecipeDao.get(recipeId, recipe => {
      // Update
      if (recipe) {
        if (!recipe.hasOwnProperty('ingredients')) {
          recipe.ingredients = [];
        }
        if (!recipe.hasOwnProperty('steps')) {
          recipe.steps = [];
        }
        this.setState({ data: recipe });
      }
      // Create
      else {
        // get last id
        let lastId = 0;
        RecipeDao.getList(snapshot => {
          snapshot.forEach(function(childSnapshot) {
            let key = childSnapshot.key;
            if (parseInt(key, 10) > parseInt(lastId, 10)) {
              lastId = key;
            }
          });
          console.log(`lastId: ${lastId}`);

          // set recipeId
          recipeId = parseInt(lastId, 10) + 1;
          let data = { name: '', ingredients: [], steps: [] };
          this.setState({ recipeId: recipeId, data: data });
        });
      }
    });
  }

  onAddIngredient() {
    let data = this.state.data;
    data.ingredients.push({ name: '' });
    this.setState({ data: data });
  }
  onAddStep() {
    let data = this.state.data;
    let step = 1;

    if (data.steps.length === 0) {
      step = 1;
    } else {
      step = data.steps[data.steps.length - 1].step + 1;
    }
    data.steps.push({ step: step });
    this.setState({ data: data });
  }
  onUpdateRecipe() {
    let data = this.state.data;
    this.setState({ updateStatus: 1 });

    RecipeDao.update(recipeId, data, () => {
      this.setState({ updateStatus: 2 });
    });
    setTimeout(() => {
      this.setState({ updateStatus: 0 });
    }, 2000);
    // console.log(data);
  }

  handleIngredientChange(e, i) {
    let data = this.state.data;
    data.ingredients[i].name = e.target.value;
    this.setState({ data: data });
  }

  handleStepChange(e, i) {
    let data = this.state.data;
    data.steps[i].desp = e.target.value;
    this.setState({ data: data });
  }

  handleNameChange(e) {
    let data = this.state.data;
    data.name = e.target.value;
    this.setState({ data: data });
  }

  render() {
    let data = this.state.data;
    console.log('render Recipe');
    let ingredients = [];
    let steps = [];
    if (data.ingredients && data.ingredients.length > 0) {
      this.state.data.ingredients.forEach((element, i) => {
        ingredients.push(
          <Ingredient
            key={`ingredient_${i}`}
            onChange={e => this.handleIngredientChange(e, i)}
            name={element.name}
          />
        );
      });
    }
    if (data.steps && data.steps.length > 0) {
      this.state.data.steps.forEach((element, i) => {
        steps.push(
          <Step
            key={`step_${i}`}
            desp={element.desp}
            onChange={e => this.handleStepChange(e, i)}
            step={element.step}
          />
        );
      });
    }

    let styleBtnUpdateText;
    let toggleDisable = false;
    let btnUpdateText;

    switch (this.state.updateStatus) {
      case 0:
        btnUpdateText = 'update';
        styleBtnUpdateText = 'btn-primary';
        break;
      case 1:
        btnUpdateText = 'updating';
        toggleDisable = true;
        styleBtnUpdateText = 'btn-warning disable';
        break;
      case 2:
        btnUpdateText = 'update complete';
        toggleDisable = true;
        styleBtnUpdateText = 'btn-success disable';
        break;
      default:
        break;
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
                value={
                  this.state.data && this.state.data.hasOwnProperty('name')
                    ? this.state.data.name
                    : ''
                }
                onChange={this.handleNameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="id">Id</label>
              <input
                type="text"
                className="form-control"
                id="id"
                value={this.state.recipeId}
                readOnly
              />
            </div>
          </div>
          <div className="form-group">
            <p>Ingredients</p>
            {ingredients}
            <button className="btn btn-block" onClick={this.onAddIngredient}>
              Add
            </button>
          </div>
          <div className="form-group">
            <p>Steps</p>
            {steps}
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

export default Recipe;
