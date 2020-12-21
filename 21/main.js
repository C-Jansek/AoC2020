const fs = require('fs');

const input = fs.readFileSync('input.csv', 'utf8').split('\n');

const recipes = input.map((recipe) => {
    regExIngredients = /((\w+\s*?)+)(?:\(contains)/;
    regExAllergens = /(?:\(contains)\s((\w+\,*\s*)+)/;
    ingredients = recipe.match(regExIngredients)[1].split(' ').slice(0, -1);
    allergens = recipe.match(regExAllergens)[1].split(', ');
    return {
        ingredients: ingredients,
        allergens: allergens,
    };
});

const allAllergens = Array.from(
    recipes.reduce((allergens, recipe) => {
        return allergens.add(...recipe.allergens);
    }, new Set())
).map(
    (uniqueAllergen) =>
        (uniqueAllergen = {
            name: uniqueAllergen,
            possibleIngredients: [],
            occurences: 0,
        })
);
const allIngredients = Array.from(
    recipes.reduce((allergens, recipe) => {
        allergens.push(...recipe.ingredients);
        return allergens;
    }, [])
);

/**
 *      Part One
 *      Determine which ingredients cannot possibly contain any of the allergens in your list.
 *
 * ??   How many times do any of those ingredients appear?
 */

// Possible Ingredients for allergens
recipes.forEach((recipe) => {
    recipe.allergens.forEach((allergen) => {
        const thisAllergen = allAllergens.find((select) => select.name === allergen);
        thisAllergen.possibleIngredients.push(...recipe.ingredients);
        thisAllergen.occurences += 1;
    });
});

// Remove ingredient if not in all recipes with specific allergen
allAllergens.map((allergen) => {
    const removedFrom = allergen.possibleIngredients.filter((ingredient) => {
        return (
            allergen.possibleIngredients.filter(
                (extraIngredient) => extraIngredient == ingredient
            ).length < allergen.occurences
        );
    });
    allergen.impossibleIngredients = removedFrom;
    allergen.possibleIngredients = allergen.possibleIngredients.filter(
        (ingredient) => !allergen.impossibleIngredients.includes(ingredient)
    );
    return allergen;
});

// Count all ingredients that are definitely not allergens
const ingredientsWithoutAllergens = allIngredients.reduce((sum, ingredient) => {
    return sum + allAllergens.reduce((includes, allergen) => {
        return includes && !allergen.possibleIngredients.includes(ingredient);
    }, true);
}, 0);

console.log('Part One:', ingredientsWithoutAllergens);


/**     Part Two
 *      Arrange the ingredients alphabetically by their allergen and separate
 *      them by commas to produce your canonical dangerous ingredient list.
 *
 * ??   What is your canonical dangerous ingredient list?
 */

//  Loop until every ingredient that is an allergen is known
while (
    allAllergens.filter((allergen) => {
        return allergen.possibleIngredients.length != 0;
    }).length > 0
) {
    allAllergens.forEach((allergen) => {
        // If ingredient is the only possible ingredient
        if (allergen.possibleIngredients.length === allergen.occurences) {
            allergen.isIn = allergen.possibleIngredients[0];

            // Remove ingredient from all other allergens
            allAllergens.forEach((secondAllergen) => {
                while (secondAllergen.possibleIngredients.includes(allergen.isIn)) {
                    secondAllergen.possibleIngredients.splice(
                        secondAllergen.possibleIngredients.indexOf(allergen.isIn),
                        1
                    );
                }
            });
        }
    });
}

// Sort to alphabetical order of allergen
allAllergens.sort((a, b) => {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
});

// Build canonical dangerous ingredient list
const canonicalDangerousIngredientList = allAllergens
    .reduce((canonical, allergen) => {
        return canonical + ',' + allergen.isIn;
    }, '')
    .slice(1);

console.log('Part Two:', canonicalDangerousIngredientList);
