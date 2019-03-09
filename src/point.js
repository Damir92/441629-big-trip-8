import {makeTime, createElement} from './utils.js';

export default class Point {
  constructor(data) {
    this._type = data.type.name;
    this._icon = data.type.icon;
    this._cities = data.cities;
    this._offers = data.offers;
    this._description = data.description;
    this._time = data.time;
    this._price = data.price;
    this._photo = data.photo;

    this._element = null;
    this._onEdit = null;
  }

  get element() {
    return this._element;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${this._icon}</i>
          <h3 class="trip-point__title">${this._type}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${makeTime(this._time.start)}&nbsp;&mdash; ${makeTime(this._time.end)}</span>
            <span class="trip-point__duration">${(this._time.end - this._time.start) / 60 / 60 / 1000}h 00m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${(Array.from(this._offers).map((offer) => (`
              <li>
                <button class="trip-point__offer">${offer.name} +&euro;&nbsp;${offer.price}</button>
              </li>`.trim()))).join(``)}
          </ul>
        </article>`;
  }

  bind() {
    this._onEditClick = () => {
      return typeof this._onEdit === `function` && this._onEdit();
    };

    this._element.addEventListener(`click`, this._onEditClick);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onEditClick);
  }
}
