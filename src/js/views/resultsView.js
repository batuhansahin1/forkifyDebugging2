import View from './View';
import previewView from './previewView';

//Bu view'ı Search sonucu oluşan verileri  onar onar kullanıcıya göstermek için oluşturduk
class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errMessage = 'No results found for your query.Try another one';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
