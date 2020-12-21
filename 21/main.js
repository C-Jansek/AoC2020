const fs = require("fs");
const _ = require("lodash");

const input = fs.readFileSync("test_input.csv", "utf8").split("\n");

recipes = input.map((recipe) => {
    regExIngredients = /((\w+\s*?)+)(?:\(contains)/;
    regExAllergens = /(?:\(contains)\s((\w+\,*\s*)+)/;
    ingredients = recipe.match(regExIngredients)[1].split(" ").slice(0, -1);
    allergens = recipe.match(regExAllergens)[1].split(" ");
    return {
        ingredients: ingredients,
        allergens: allergens,
    };
});

console.log(recipes);
