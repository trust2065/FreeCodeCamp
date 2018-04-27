import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Ingredient from "./Ingredient.js";
import Step from "./Step.js";
import RecipeDao from "./RecipeDao.js";

let recipeId;
class Recipe extends Component {
  constructor(props) {
    super(props);

    recipeId = this.props.match.params.id;
    console.log("recipe id: " + recipeId);

    let data = { name: "", ingredients: [], steps: [] };
    this.state = { data: data };

    this.onAddIngredient = this.onAddIngredient.bind(this);
    this.onAddStep = this.onAddStep.bind(this);
    this.onUpdateRecipe = this.onUpdateRecipe.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIngredientChange = this.handleIngredientChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
  }

  componentDidMount() {
    RecipeDao.get(recipeId, recipe => {
      this.setState({ data: recipe });
    });
  }

  onAddIngredient() {
    let data = this.state.data;
    data.ingredients.push({ name: "" });
    this.setState({ data: data });
  }
  onAddStep() {
    let data = this.state.data;
    let step = data.steps[data.steps.length - 1].step + 1;
    data.steps.push({ step: step });
    this.setState({ data: data });
  }
  onUpdateRecipe() {
    let data = this.state.data;
    RecipeDao.update(recipeId, data);
    console.log(data);
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
    console.log("render Recipe");
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
          <Step key={`step_${i}`} 
          desp={element.desp} 
          onChange={e => this.handleStepChange(e, i)} 
          step={element.step} 
          />
        );
      });
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
                value={this.state.data && this.state.data.hasOwnProperty("name") ? this.state.data.name : ""}
                onChange={this.handleNameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="id">Id</label>
              <input type="text" className="form-control" id="id" readOnly />
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
          <button className="btn btn-block" onClick={this.onUpdateRecipe}>
            Update
          </button>
        </div>
      </div>
    );
  }
}

export default Recipe;
