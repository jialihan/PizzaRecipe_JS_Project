import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likesView';
import {elements, renderSpinner, clearSpinner} from './views/base';

/**
 * Global state of our app
 * - Search object
 * - current recipe objec
 * - shopping list object
 * - liked recipes
 */
const state = {}

/**
 * Search Controller
 */
const searchSubmitHandler = async ()=>{
    // TODO: get user input from view part
    const query = searchView.getInput();
    if(query)
    {
        // 2) new search object and add to state
        state.search = new Search(query);

        // 3) prepare UI for result
        searchView.clearInput();
        searchView.clearSearchResults();
        renderSpinner(elements.searchRes);

        try{
        // 4) search for recipes
        await state.search.getResults();
 
        // 5) render result on UI, insert html
        clearSpinner();
        searchView.renderResults(state.search.result);}
        catch(err)
        {
            alert("something wrong with searching...")
            clearSpinner();
        }
    }
}

elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    searchSubmitHandler();
});
elements.pageRes.addEventListener('click', e=>{
    e.preventDefault();
    const btn = e.target.closest('.btn-inline');
    if(btn)
    {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearSearchResults();
        searchView.renderResults(state.search.result, gotoPage);
        // console.log(gotoPage);
    }
});

/**
 * Recipe controller
 */
// const r = new Recipe(46956);
// r.getRecipe();
// console.log(r);
const recipeSelectedHandler = async () =>{
    const id = window.location.hash.replace('#', '');
    if(id)
    {
       
        // prepare io fpr changes
        recipeView.clearRecipe();
        renderSpinner(elements.recipe);

        // highlight selected item
        if(state.search)
        {
         searchView.highlightSelected(id);
        }

        // create new recipe object
        state.recipe = new Recipe(id);
        // get recipe data
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            clearSpinner();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        }catch(err)
        {
            alert(err);
        }
     }
}


const listController = ()=>{
    // create a list if there not yet
    if(!state.list)
    {
        state.list = new List();
    }

    // add each ingredient
    state.recipe.ingredients.forEach(el=>{
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        console.log(item);
        listView.renderItem(item);
    });
}


/**
 like controller
 */
const likeController = ()=>{
    // create a list if there not yet
    if(!state.likes)
    {
        state.likes = new Like();
    }
    const curId = state.recipe.id;

    if(!state.likes.isLiked(curId))
    { 
         // user will like this

         // add like to the state
         const newLike = state.likes.addLike(curId, state.recipe.title, state.recipe.publisher, state.recipe.img);

         // toggle like button
         likeView.toggleLikeButton(true);
         // add like to UI list
         likeView.renderLike(newLike);
         console.log(state.likes)

    }
    else{
         // user not like this

         // remove like from state
         state.likes.deleteLike(curId);

         // toggle like button
         likeView.toggleLikeButton(false);

         // remove from UI list
         likeView.deleteLike(curId);
         console.log(state.likes)
    }
     // hide or show menu like icon
     likeView.toggleLikeMenu(state.likes.getNumOfLikes());
}



['hashchange', 'load'].forEach(el=>{
    window.addEventListener(el, recipeSelectedHandler);
});

// handle serving button click
elements.recipe.addEventListener('click', e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *'))
    {
        // decreae button clicked
        if(state.recipe.servings > 1)
        {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increasee, .btn-increase *'))
    {
        // increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *'))
    {
        // add to shopping list clicked
        listController();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *'))
    {
         // trigger liked controller
         likeController();
    }
});

// handle add/dec/delete shoppinglist
elements.shoppinglist.addEventListener('click', e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *'))
    {
        // delete from state
        state.list.deleteItem(id);

        // delete form ui
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value'))
    {
        // update count
        const val = parseFloat(e.target.value, 10); // input element
        // console.log(val);
        state.list.updateCount(id,val);
    }
});

// restore like recipe on page loaded
window.addEventListener('load', e=>{
    state.likes = new Like();
    // restore data
    state.likes.readLocalStorage();

    // toggle like menu
    likeView.toggleLikeMenu(state.likes.getNumOfLikes());

    // render existing likes
    state.likes.likes.forEach(like=>{
        likeView.renderLike(like);
    })

});
// window.state = state;
