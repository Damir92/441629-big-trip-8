import Component from './component.js';

export default class TotalPrice extends Component {
  constructor(data) {
    super();
    this._price = data;
  }

  get template() {
    return `<span class="trip__total-cost">Total: &euro;&nbsp;${this._price}</span>`;
  }
}
