import { RES_PER_PAGE } from '../config';
import View from './View';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');
  _curPage;
  _generateMarkup() {
    this._curPage = this._data.page;
    const totalPage = Math.ceil(
      this._data.recipes.length / this._data.resultsPerPage
    );

    if (totalPage > 1) {
      //aradaki sayfalar için
      if (this._curPage - 1 > 0 && this._curPage < totalPage) {
        return `<button data-goto="${
          this._curPage - 1
        }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use  href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._curPage - 1}</span>
      </button>
      <button data-goto="${
        this._curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${this._curPage + 1}</span>
        <svg class="search__icon">
          <use  href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
      }
      //last page için
      if (this._curPage === totalPage) {
        return `<button data-goto="${
          this._curPage - 1
        }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use  href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._curPage - 1}</span>`;
      } //first page için
      else {
        return `<button data-goto="${
          this._curPage + 1
        }" class="btn--inline pagination__btn--next">
        <span>Page ${this._curPage + 1}</span>
        <svg  class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
      }
    } else {
      return '';
    }
  }
  addHandlerPagination(handlerFunc) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handlerFunc(goToPage);
    });
  }
}

export default new PaginationView();
