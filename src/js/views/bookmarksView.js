import View from './View';
class BookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks yet.Find a nice recipe and bookmark it :)';
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    console.log(this._data);

    return this._data
      .map(
        bookmark => `<li class="preview">
        <a class="preview__link ${
          id === bookmark.id ? 'preview__link--active' : ''
        }" href="#${bookmark.id}">
          <figure class="preview__fig">
            <img src="${bookmark.imageUrl}" alt="${bookmark.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${bookmark.title}</h4>
            <p class="preview__publisher">${bookmark.publisher}</p>
          
          </div>
        </a>
      </li>`
      )
      .join('');
  }
  addHandlerRender(handlerFunc) {
    window.addEventListener('load', handlerFunc);
  }
}
export default new BookmarkView();
