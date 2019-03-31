import Component from './component.js';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._isChecked = data.checked;

    this._onFilterClick = this._onFilterClick.bind(this);

    this._onFilter = null;
  }

  _onFilterClick(evt) {
    evt.preventDefault();

    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `
    <span>
      <input
        type="radio"
        id="filter-${this._name}"
        name="filter"
        value="${this._name}"
        ${ this._isChecked ? `checked` : `` }
      />
      <label class="trip-filter__item"
        for="filter-${this._name}">
          ${this._name}
      </label>
    </span>`.trim();
  }

  bind() {
    this._element.querySelector(`input`).addEventListener(`change`, this._onFilterClick);
  }

  unbind() {
    this._element.querySelector(`input`).removeEventListener(`change`, this._onFilterClick);
  }

}
