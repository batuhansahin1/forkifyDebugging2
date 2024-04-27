import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helpers';
//ileride veriyi güncellediğimizde işe yarayacak yoksa loadRecipe den de gelen veriyi döndürüp Promise'in çözümlenmesini bekleyip onu view fonksiyonlarına parametre olarak geçebilirdik
export const state = {
  recipe: {},
  search: {
    recipes: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      publisher: recipe.publisher,
      cookingTime: recipe.cooking_time,
      imageUrl: recipe.image_url,
      servings: recipe.servings,
      source_url: recipe.source_url,
      title: recipe.title,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};
export const loadSearchResults = async function (queryString) {
  try {
    const data = await getJSON(`${API_URL}/?search=${queryString}`);
    let { recipes } = data.data;
    console.log(recipes);
    state.search.recipes = recipes.map(recipe => {
      return {
        publisher: recipe.publisher,
        id: recipe.id,
        imageUrl: recipe.image_url,
        title: recipe.title,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.recipes.slice(start, end);
};
export const updateServings = function (servings = state.recipe.servings) {
  console.log(servings);

  const servingOdd = servings / state.recipe.servings;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * servingOdd;
  });
  state.recipe.servings = servings;
};
const addBookmarkLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const deleteBookmarks = function (id) {
  const indexOfRecipe = state.bookmarks.findIndex(
    bookmark => id === bookmark.id
  );

  state.bookmarks.splice(indexOfRecipe, 1);
  console.log(state.bookmarks);
  if (state.recipe.id === id) state.recipe.bookmarked = false;
  addBookmarkLocalStorage();
};
export const addBookmarks = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  console.log(state.bookmarks);
  addBookmarkLocalStorage();
};
//sayfa ilk çağrıldığında localStoragedeki veriyi alabileceğimiz fonksiyon lazım
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
