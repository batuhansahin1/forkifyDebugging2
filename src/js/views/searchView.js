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
  // renderError(message = this._errMessage) {
  //   const markup = `<div class="error">
  //   <div>
  //     <svg>
  //       <use href="${icons}#icon-alert-triangle"></use>
  //     </svg>
  //   </div>
  //   <p> ${message}</p>
  // </div> `;
  //   this._clear();
  //   this._parentEl.insertAdjacentHTML('afterbegin', markup);
  // }
  addHandlerSearch(handlerfunc) {
    //burada formu seçip submit eventi desem de butona click eventi desem de ikisi de aynı işlemi gerçekleştiriyor ikisnde de searchQuery'i girip enter yaptığında ya da mouse ile butona tıkladığında veri gönderiliyor
    // document
    //   .querySelector('.search__btn')
    //   .addEventListener('click', function (e) {
    //     e.preventDefault();
    //     handlerfunc();
    //   });
    this._parentEl.addEventListener('submit', function (event) {
      event.preventDefault();
      handlerfunc();
    });
  }
}

export default new SearchView();
//sadece tarif eklenen tariflerde kullanılacak
// <div class="preview__user-generated">
//   <svg>
//     <use href="${icons}#icon-user"></use>
//   </svg>
//</div>
