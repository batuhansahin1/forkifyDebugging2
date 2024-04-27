

//polyfilling everything else
import 'core-js/stable';
//polyfilling async await
import 'regenerator-runtime/runtime';
import 'core-js/actual';
// import recipeView from './views/recipeView';
import recipeView from './views/recipeView';
import * as model from './model';
import searchViewIns from './views/searchView';
import resultsViewIns from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;

    recipeView.renderSpinner();
    //update resultsview to mark selected search result
    resultsViewIns.update(model.getSearchResultsPage());
    //updatede hata veriyo ama sadece bookmarksView hata veriyor
    bookmarksView.update(model.state.bookmarks);
  

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
   

   
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
const controlSearchResult = async function () {
  try {
    //getting input data
    const input = searchViewIns.getInput();
    if (!input) return;

    resultsViewIns.renderSpinner();
    //load search results
    await model.loadSearchResults(input);
    //render search result
    resultsViewIns.render(model.getSearchResultsPage());


    paginationView.render(model.state.search);
  } catch (err) {
    resultsViewIns.renderError();
    alert(err);
  }
};
const controlPagination = function (gotoPage) {
  //pageyi güncelledik
  resultsViewIns.render(model.getSearchResultsPage(gotoPage));
  //burada da  butonları yazdırdık
  paginationView.render(model.state.search);
};
const controlServings = function (servings) {
  console.log(servings);
  model.updateServings(servings);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {

  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);
 
  recipeView.update(model.state.recipe);
  
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchViewIns.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmarks(controlAddBookmark);
  bookmarksView.addHandlerRender(controlBookmarks);
};
///////////////////////////////////////
init();

