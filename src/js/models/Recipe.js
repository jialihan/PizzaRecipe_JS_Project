import axios from 'axios';

export default class Recipe{
    constructor(id)
    {
        this.id = id;
    }

    async getRecipe()
    {
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(err){
            alert("Something went wrong! :( ");
        }
    }

    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }
    calcServings(){
        this.servings = 4;
    }
    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el=>{
            // 1. uniform units
            let ingredient  = el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })
            // 2. remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. pares the ingreidnets into count, unit, and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el=>{
                return units.includes(el);
            });

            let objIng;
            if(unitIndex >=0)
            {
                // there is a unit
                // eg: 1 1/2 cups => ['1','1/2']
                // eg: 4 cups => ['4']
                const arrCount = arrIng.slice(0, unitIndex); 
                let count;
                if(arrCount === 1)
                {
                    // eval('1-1/2') -> '1.5'
                    count = eval(arrIng[0].replace('-', '+'));
                }else
                {
                    // eval('4+1/2') ---->  '4.5'
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1, arrIng.length).join(' ')
                };

            }
            else if(parseInt(arrIng[0], 10))
            {
                // no unit, but 1st is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if(unitIndex === -1)
            {
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient // in ES6, k-v same name
                };
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }
    updateServings(type)
    {
        // servings
        const newServings = type === 'dec' ? this.servings-1 : this.servings + 1;

        // ingredients
        this.ingredients.forEach(ing=>{
            ing.count  *= (newServings / this.servings);
            ing.count = ing.count.toFixed(2);
            console.log(ing.count);
        })
        
        this.servings = newServings;
    }
}
