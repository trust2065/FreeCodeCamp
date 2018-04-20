import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Ingredient from "./Ingredient.js";
import Step from "./Step.js";

// let data = {
//   ingredients: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }],
//   steps: [{ step: 1, desp: "add sugar" }, { step: 2, desp: "add salt" }]
// };
let data = {
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
    this.state = { data };
    this.setState({ data: data });
    this.onAddIngredient = this.onAddIngredient.bind(this);
    this.onAddStep = this.onAddStep.bind(this);
  }
  onAddIngredient() {
    data.ingredients.push({ name: "" });
    this.setState({ data: data });
  }
  onAddStep() {
    data.steps.push({ step: "" });
    this.setState({ data: data });
  }
  render() {
    let ingredients = [];
    data.ingredients.forEach(element => {
      ingredients.push(<Ingredient key={element.name} name={element.name} />);
    });
    let steps = [];
    data.steps.forEach(element => {
      steps.push(<Step key={element.step} desp={element.desp} step={element.step}/>);
    });
    return <div className="container">
        <div className="contents">
          <div className="d-flex justify-content-between">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" />
            </div>
            <div className="form-group">
              <label htmlFor="id">Id</label>
              <input type="text" className="form-control" id="id" />
            </div>
          </div>
          <div className="form-group">
            <p>Ingredients</p>
            {ingredients}
            <button class="btn btn-block" onClick={this.onAddIngredient}>
              Add
            </button>
          </div>
          <div className="form-group">
            <p>Steps</p>
            {steps}
            <button class="btn btn-block" onClick={this.onAddStep}>
              Add
            </button>
          </div>
        </div>
        <div className="ctrlBtns">
          <button className="btn btn-block">Update</button>
        </div>
      </div>;
  }
}

export default Recipe;
