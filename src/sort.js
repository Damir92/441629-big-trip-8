import Component from './component.js';

export default class Sort extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._isChecked = data.checked;

    this._onSortClick = this._onSortClick.bind(this);

    this._onSort = null;
  }

  _onSortClick(evt) {
    evt.preventDefault();

    if (typeof this._onSort === `function`) {
      this._onSort();
    }
  }

  set onSort(fn) {
    this._onSort = fn;
  }

  get template() {
    return `
    <span>
      <input
        type="radio"
        name="trip-sorting"
        id="sorting-${this._name}"
        value="${this._name}"
        ${ this._isChecked ? `checked` : `` }
      />
      <label
        class="trip-sorting__item trip-sorting__item--${this._name}"
        for="sorting-${this._name}"
      >
        ${this._name}
      </label>
    </span>`.trim();
  }

  bind() {
    this._element.querySelector(`input`).addEventListener(`change`, this._onSortClick);
  }

  unbind() {
    this._element.querySelector(`input`).removeEventListener(`change`, this._onSortClick);
  }

}
