import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Ingredient from "./Ingredient.js";
import Step from "./Step.js";
import RecipeDao from "./RecipeDao.js";

// let data = {
//   ingredients: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }],
//   steps: [{ step: 1, desp: "add sugar" }, { step: 2, desp: "add salt" }]
// };
let data = {
  id: 1,
  name: "英式炒蛋",
  ingredients: [{ name: "雞蛋" }, { name: "油" }, { name: "牛奶" }],
  steps: [
    { step: 1, desp: "打蛋、盡量打勻" },
    { step: 2, desp: "熱鍋熱油後再下蛋" },
    { step: 3, desp: "耐心等到邊邊成形後用鍋鏟摺疊蛋" },
    { step: 4, desp: "不用等到全熟，中間有點生的吃最好吃" }
  ]
};

class Recipe extends Component {
  constructor(props) {
    super(props);
    console.log("contructor");
    console.log(this.props.match.params.id);
    this.state = { data: data };
    // this.setState({ data: data });
    this.onAddIngredient = this.onAddIngredient.bind(this);
    this.onAddStep = this.onAddStep.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  onAddIngredient() {
    data.ingredients.push({ name: "" });
    this.setState({ data: data });
  }
  onAddStep() {
    let step = data.steps[data.steps.length - 1].step + 1;
    data.steps.push({ step: step });
    this.setState({ data: data });
  }
  onUpdateRecipe() {
    RecipeDao.update("2", data);
    console.log(data);
  }

  handleIngredientChange(e, i) {
    data.ingredients[i].name = e.target.value;
    this.setState({ data: data });
  }

  handleStepChange(e, i) {
    data.steps[i].desp = e.target.value;
    this.setState({ data: data });
  }

  handleNameChange(e) {
    data.name = e.target.value;
    this.setState({ data: data });
  }

  render() {
    console.log("render");
    let ingredients = [];
    this.state.data.ingredients.forEach((element, i) => {
      ingredients.push(
        <Ingredient
          key={`ingredient_${i}`}
          onChange={e => this.handleIngredientChange(e, i)}
          name={element.name}
        />
      );
    });
    let steps = [];
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
                value={this.state.data.name}
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
