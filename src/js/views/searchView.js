import {elements, renderSpinner, elementClasses} from './base';

export const getInput = ()=>
 elements.searchInput.value; 

export const clearInput = ()=> {
    elements.searchInput.value = '';
}
export const clearSearchResults = ()=> {
   elements.searchResList.innerHTML = '';
   elements.pageRes.innerHTML = '';
}
export const highlightSelected = id =>{
    const resArr = Array.from(document.querySelectorAll('.results__link'));
    resArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

// "this is a title"
// acc1: 0, this => return 0 + 4 = 4
// acc2: 4, is => return 4 + 2 = 6
// ...
export const limitRecipeTitle = (title, limit = 17) =>{
    // limit char in title string
    const newTitle= [];
    if(title.length > limit)
    {
        title.split(' ').reduce((acc,cur)=>{
            if(acc + cur.length <= limit)
            {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
}
const  renderRecipe = (recipe)=>{
    const limitedTitle = limitRecipeTitle(recipe.title);
    const recipeHTML = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${limitedTitle}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitedTitle}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', recipeHTML);
}
const createButton = (curPage, type)=>{
   const direction =  type === 'prev' ? 'left' : 'right';
   const buttonPage = type === 'prev' ? curPage -1 : curPage + 1;
   const markup = `
        <button class="btn-inline results__btn--${type}" data-goto=${buttonPage}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${direction}"></use>
        </svg>
        <span>Page ${buttonPage}</span>
        </button>
    `;
    return markup;
}
const renderPageButtons = (curPage, totalNumber, perPage) =>{
    const pages = Math.ceil(totalNumber / perPage);
    let button;
    if(curPage === 1 && pages >  1)
    {
        // only next button
        button = createButton (curPage, 'next');
    }else if(curPage < pages)
    {
        // both button 
        button = `
            ${createButton(curPage, 'prev')}
            ${createButton (curPage, 'next')}
        `;
    }
    else if(curPage === pages && pages > 1){
       // last page: only prev button
       button = createButton (curPage, 'prev');
    }
    elements.pageRes.insertAdjacentHTML('afterbegin', button);
}

    export const renderResults = (recipes, curPage = 1, perPage = 10) =>{
    const start = (curPage - 1) * perPage;
    const end = curPage * perPage;
    recipes.slice(start, end).forEach(el => {
            renderRecipe(el);
        });
    renderPageButtons(curPage, recipes.length, perPage);
}