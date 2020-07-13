// all elements selected from dom
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    pageRes: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppinglist: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}
export const elementClasses = {
    loader: 'loader'
}

export const renderSpinner = (parent) =>
{
     const spinner =  `
     <div class="loader">
        <svg>
        <use href="img/icons.svg#icon-cw"> 
        </svg>
     </div>
     `;
     parent.insertAdjacentHTML('afterbegin', spinner);
}

export const clearSpinner = (parent) =>
{
    const spinner = document.querySelector(`.${elementClasses.loader}`);
    if(spinner){
        spinner.parentNode.removeChild(spinner);
    }
    
}