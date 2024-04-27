//parcelde sadece js dosyaları değil her türden dosyaları import edebiliyoruz mesela svg,png
// import icons from '../img/icons.svg'; //parcel 1
// import icons from 'url:../img/icons.svg'; //parcel2
//buna burda ihtiyacımız yok viewde import ettik
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
//iconların gözükmemesinin sebebi biz sayfamızı dist folderdaki dosyalara göre yayınlıyoruz ama buradaki js de kullandığımız icon dosya yolu bizim developer ortamındaki index.html'e göre aldığımız dosya yolu biz burada bunu dist folder'a göre olan dosya yolu bunu dist foldera gidince de görebiliyorsun "src/icons.svg#icon-user" bu şekilde gözüküyor ama bunun dist folderın içindeki icons svg olması lazım yani biz aslında bizim developer ortamındaki js'e göre path'i ayarlarsak parcel onu çevirip dist folderdaki icons.svg yapar ki yukardaki import ettiğimiz icons'u console'a loglayınca dosya yolu olarak:distteki icons.svg geliyor

//bir veri göndermemiz gerektiğinde bu kullanışlı olur ama veri göndermediğimiz zaman direkt instanceyi export etmek daha sağlıklı yani ilk recipeView importu gibi bunun gibi tanımladığında constructor'a veri göndermen için  recipeView instance'ını yeniden oluşturuyorsun ama bu sefer recipeView class oluyor
//const recipeView=new recipeView(model.state.recipe) ya da şöyle
//recipeView.render(model.state.recipe)

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
    //update result view to marked selected search result Burada çağrılmasının amacı searchResults'da seçilen recipeyi active olarak göstermek burada çağırmazsak search yaptığımızda sadece ilk yüklenen id'li recipeyi active gösteriyor ondan sonra tıkladığımız hiçbir result active olarak gösterilmiyor biz searchResult sonucu listelenen resultlardan tıklanan resuultın active olarak işaretlenmesi ve bu sürecin farklı resultları tıklandıkça devam etmesi için bu fonksiyonu burada çağırdık

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
    //export import arası live connection olduğu için loadRecipe içinde state.recipe atandığında içindeki veri de güncellenir ve aşağıda güncel recipeyi kullanabiliriz

    // recipeView.render(model.state.recipe);
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
    //render search results
    // resultsViewIns.render(model.state.search.recipes);
    //bu hepsini gösteriyor ama biz resultsView ile kendi göstermek istediğimiz kadarını göndereceğiz
    console.log(model.state.search.recipes);

    resultsViewIns.render(model.getSearchResultsPage());

    //ilk butonları gösteriyoruz
    //page verisini alabilmek için bütün nesneyi data olarak gönderdik çünkü buna pagination view'da ihtiyacımız var
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
  //burada bookmarked edilmiş ise onu booklmarks'dan siliyoruz çünkü eklenmiş değeri bookmarkdan çıkardık
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);
  //recipeView i güncellemek kaldı çünkü bookmarked değerleri değişti
  recipeView.update(model.state.recipe);
  //bookmarksView'i göstermemiz lazım
  bookmarksView.render(model.state.bookmarks);
};
//sayfa yüklendiğinde bookmarklanmış reçeteleri göstermek için
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

// const loadRecipe = async function (id) {
//   try {
// application logic
//     const id = window.location.hash.slice(1);
//     if (!id) return;
//Presentation logic view
//     renderSpinner(recipeContainer);
//business logic model
//     const res = await fetch(
//       `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
//     );
//     console.log(res);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     console.log(res, data);
//     let { recipe } = data.data;
//     recipe = {
//       id: recipe.id,
//       publisher: recipe.publisher,
//       cookingTime: recipe.cooking_time,
//       imageUrl: recipe.image_url,
//       servings: recipe.servings,
//       source_url: recipe.source_url,
//       title: recipe.title,
//       ingredients: recipe.ingredients,
//     };
//     //render recipe
//     recipeContainer.innerHTML = '';
//     //bütün malzemeleri göstermek için iki farklı yöntem biri değişkene ekleme diğeri ise join methodu kullanarak direkt diziyi yazdırma
//     let listIng = '';
//     recipe.ingredients.map(ing => {
//       listIng += `<li class="recipe__ingredient">
//           <svg class="recipe__icon">
//              <use href="${icons}#icon-check"></use>
//           </svg>
//            <div class="recipe__quantity">${
//              ing.quantity ? ing.quantity : ''
//            }</div>
//            <div class="recipe__description">
//              <span class="recipe__unit">${ing.unit}</span>
//              ${ing.description}
//            </div>
//          </li>`;
//     });
//     const markup = `
//     <figure class="recipe__fig">
//       <img src="${recipe.imageUrl}" alt="Tomato" class="recipe__img" />
//       <h1 class="recipe__title">
//         <span>${recipe.title}</span>
//       </h1>
//     </figure>

//     <div class="recipe__details">
//       <div class="recipe__info">
//         <svg class="recipe__info-icon">
//           <use href="${icons}#icon-clock"></use>
//         </svg>
//         <span class="recipe__info-data recipe__info-data--minutes">${
//           recipe.cookingTime
//         }</span>
//         <span class="recipe__info-text">minutes</span>
//       </div>
//       <div class="recipe__info">
//         <svg class="recipe__info-icon">
//           <use href="${icons}#icon-users"></use>
//         </svg>
//         <span class="recipe__info-data recipe__info-data--people">${
//           recipe.servings
//         }</span>
//         <span class="recipe__info-text">servings</span>

//         <div class="recipe__info-buttons">
//           <button class="btn--tiny btn--increase-servings">
//             <svg>
//               <use href="${icons}#icon-minus-circle"></use>
//             </svg>
//           </button>
//           <button class="btn--tiny btn--increase-servings">
//             <svg>
//               <use href="${icons}#icon-plus-circle"></use>
//             </svg>
//           </button>
//         </div>
//       </div>

//       <div class="recipe__user-generated">
//         <svg>
//           <use href="${icons}#icon-user"></use>
//         </svg>
//       </div>
//       <button class="btn--round">
//         <svg class="">
//           <use href="${icons}#icon-bookmark-fill"></use>
//         </svg>
//       </button>
//     </div>

//     <div class="recipe__ingredients">
//       <h2 class="heading--2">Recipe ingredients</h2>
//       <ul class="recipe__ingredient-list">
//         ${recipe.ingredients
//           .map(
//             ing => `<li class="recipe__ingredient">
//         <svg class="recipe__icon">
//            <use href="${icons}#icon-check"></use>
//         </svg>
//          <div class="recipe__quantity">${ing.quantity ? ing.quantity : ''}</div>
//          <div class="recipe__description">
//            <span class="recipe__unit">${ing.unit}</span>
//            ${ing.description}
//          </div>
//        </li>`
//           )
//           .join('')}

//       </ul>
//     </div>

//     <div class="recipe__directions">
//       <h2 class="heading--2">How to cook it</h2>
//       <p class="recipe__directions-text">
//         This recipe was carefully designed and tested by
//         <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
//         directions at their website.
//       </p>
//       <a
//         class="btn--small recipe__btn"
//         href="${recipe.source_url}"
//         target="_blank"
//       >
//         <span>Directions</span>
//         <svg class="search__icon">
//           <use href="${icons}#icon-arrow-right"></use>
//         </svg>
//       </a>
//     </div>`;
//     recipeContainer.insertAdjacentHTML('afterbegin', markup);
//   } catch (err) {
//     alert(err);
//   }
// };

// const renderRecipe = function (recipe) {
//   //renderRecipe yaparken bu fonksiyon çağrıldığında parentElementi temizlediğimiz için spinner kaybolur
//   recipeContainer.innerHTML = '';
//   //bütün malzemeleri göstermek için iki farklı yöntem biri değişkene ekleme diğeri ise join methodu kullanarak direkt diziyi yazdırma
//   let listIng = '';
//   recipe.ingredients.map(ing => {
//     listIng += `<li class="recipe__ingredient">
//         <svg class="recipe__icon">
//            <use href="${icons}#icon-check"></use>
//         </svg>
//          <div class="recipe__quantity">${ing.quantity ? ing.quantity : ''}</div>
//          <div class="recipe__description">
//            <span class="recipe__unit">${ing.unit}</span>
//            ${ing.description}
//          </div>
//        </li>`;
//   });
//   const markup = `
//   <figure class="recipe__fig">
//     <img src="${recipe.imageUrl}" alt="Tomato" class="recipe__img" />
//     <h1 class="recipe__title">
//       <span>${recipe.title}</span>
//     </h1>
//   </figure>

//   <div class="recipe__details">
//     <div class="recipe__info">
//       <svg class="recipe__info-icon">
//         <use href="${icons}#icon-clock"></use>
//       </svg>
//       <span class="recipe__info-data recipe__info-data--minutes">${
//         recipe.cookingTime
//       }</span>
//       <span class="recipe__info-text">minutes</span>
//     </div>
//     <div class="recipe__info">
//       <svg class="recipe__info-icon">
//         <use href="${icons}#icon-users"></use>
//       </svg>
//       <span class="recipe__info-data recipe__info-data--people">${
//         recipe.servings
//       }</span>
//       <span class="recipe__info-text">servings</span>

//       <div class="recipe__info-buttons">
//         <button class="btn--tiny btn--increase-servings">
//           <svg>
//             <use href="${icons}#icon-minus-circle"></use>
//           </svg>
//         </button>
//         <button class="btn--tiny btn--increase-servings">
//           <svg>
//             <use href="${icons}#icon-plus-circle"></use>
//           </svg>
//         </button>
//       </div>
//     </div>

//     <div class="recipe__user-generated">
//       <svg>
//         <use href="${icons}#icon-user"></use>
//       </svg>
//     </div>
//     <button class="btn--round">
//       <svg class="">
//         <use href="${icons}#icon-bookmark-fill"></use>
//       </svg>
//     </button>
//   </div>

//   <div class="recipe__ingredients">
//     <h2 class="heading--2">Recipe ingredients</h2>
//     <ul class="recipe__ingredient-list">
//       ${recipe.ingredients
//         .map(
//           ing => `<li class="recipe__ingredient">
//       <svg class="recipe__icon">
//          <use href="${icons}#icon-check"></use>
//       </svg>
//        <div class="recipe__quantity">${ing.quantity ? ing.quantity : ''}</div>
//        <div class="recipe__description">
//          <span class="recipe__unit">${ing.unit}</span>
//          ${ing.description}
//        </div>
//      </li>`
//         )
//         .join('')}

//     </ul>
//   </div>

//   <div class="recipe__directions">
//     <h2 class="heading--2">How to cook it</h2>
//     <p class="recipe__directions-text">
//       This recipe was carefully designed and tested by
//       <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
//       directions at their website.
//     </p>
//     <a
//       class="btn--small recipe__btn"
//       href="${recipe.source_url}"
//       target="_blank"
//     >
//       <span>Directions</span>
//       <svg class="search__icon">
//         <use href="${icons}#icon-arrow-right"></use>
//       </svg>
//     </a>
//   </div>`;
//   recipeContainer.insertAdjacentHTML('afterbegin', markup);
// };

//Immidiately invoked asenkron function expression IIAFE
//bunu tek katmanda yaptığımız için böyle kullanmak zorunda kaldım farklı katmanlarda orsaydı iki asenkron fonksiyon olarak kullanıp loadRecipeyi await yapabilirdim
// (async () => {
//   const recipe = await loadRecipe();
//   console.log(recipe);
//   renderRecipe(recipe);
// })();
//hoca yukarıda kullandığım yapıyı kullanmak yerine direkt loadRecipe fonksiyonunun içinde renderRecipe fonksiyonunun yaptığı işlemleri gerçekleştirdi

// window.addEventListener('hashchange', function (e) {
//   console.log(e);
//   // const id = e.newURL.split('#')[1];
//   const id = e.target.location.hash.split('#')[1];
//   if (id) loadRecipe(id);
// });
// window.addEventListener('load', function (e) {
//   console.log(e);
//   const id = e.target.location.hash.split('#')[1];

//   if (id) loadRecipe(id);
// });
// ['hashchange', 'load'].forEach(el =>
//   window.addEventListener(el, function (e) {
//     // const id = e.newURL.split('#')[1];
//     const id = e.target.location.hash.split('#')[1];
//     if (!id) return;
//     loadRecipe(id);
//   })
// );
// ['hashchange', 'load'].forEach(el => window.addEventListener(el, loadRecipe));
