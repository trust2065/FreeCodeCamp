import database from "./Firebase.js";

export function update(id = 'A2', data) {
  console.log("updateRecipe");

  let {name, ingredients, steps} = data;
  // let name = "美式炒蛋";
  // let ingredients = [{ name: "雞蛋" }, { name: "油" }, { name: "牛奶" }];
  // let steps = [
  //   { step: 1, desp: "打蛋、盡量打勻" },
  //   { step: 2, desp: "熱鍋熱油後再下蛋" },
  //   { step: 3, desp: "耐心等到邊邊成形後用鍋鏟摺疊蛋" },
  //   { step: 4, desp: "不用等到全熟，中間有點生的吃最好吃" }
  // ];
  console.log(data);

  database
    .ref("recipe/" + id)
    .update({ name: name, ingredients: ingredients, steps: steps })
    .catch(function(error) {
      console.error("update錯誤", error);
    });
}

// export default updateRecipe;
export default { update };