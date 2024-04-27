//sadece classın kendisini export etmek istediğimiz için böyle yaptık bu classtan örnek oluşturmayacağımız için aşağıdaki şekilde export ettik bu classı sadece inheritance için kullanacağız parent class olarak
import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    console.log(this._data);
    const newMarkUp = this._generateMarkup();
    //stringi Dom node object'e çevirdik(buradaki newDom bildiğimiz document gibi kullanılabiliyor DOM nesnesinin kullanabildiği bütün fonksiyonları kullanabiliyor)
    const newDom = document.createRange().createContextualFragment(newMarkUp);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));
    console.log(newElements, curElements);
    // benim kod
    // newElements.forEach((newEl, i) => {
    //   const curEl = curElements[i];
    //   if (!newEl.isEqualNode(curEl)) curEl.innerHTML = newEl.innerHTML;
    // });
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
    //hocanın kod
    // newElements.forEach((newEl, i) => {
    //   const curEl = curElements[i];
    //   if (
    //     !newEl.isEqualNode(curEl) &&
    //     newEl.firstChild?.nodeValue.trim() !== ''
    //   )
    //     curEl.textContent = newEl.textContent;

    //   if (!newEl.isEqualNode(curEl)) {
    //     Array.from(newEl.attributes).forEach(attr =>
    //       curEl.setAttribute(attr.name, attr.value)
    //     );
    //   }
    // });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markup1 = ` <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
     `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup1);
  }
  renderError(message = this._errMessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p> ${message}</p>
    </div> `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p> ${message}</p>
  </div> `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
