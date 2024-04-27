import icons from 'url:../../img/icons.svg';

class SearchView {
  _parentEl = document.querySelector('.search');
  _errMessage = 'Recipe not found';
  _clear() {
    this._parentEl.innerHTML = '';
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  getInput() {
    const input = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return input;
  }

  addHandlerSearch(handlerfunc) {
    
    this._parentEl.addEventListener('submit', function (event) {
      event.preventDefault();
      handlerfunc();
    });
  }
}

export default new SearchView();

