import Component from './component.js';
import moment from 'moment';

export default class Point extends Component {
  constructor(data) {
    super();
    this._type = data.type.name;
    this._icon = data.type.icon;
    this._cities = data.cities;
    this._offers = data.offers;
    this._description = data.description;
    this._time = data.time;
    this._price = data.price;
    this._photo = data.photo;

    this._onEdit = null;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${this._icon}</i>
          <h3 class="trip-point__title">${this._type}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${moment(this._time.start).format(`HH:mm`)}&nbsp;&mdash; ${moment(this._time.end).format(`HH:mm`)}</span>
            <span class="trip-point__duration">${moment.utc(this._time.end - this._time.start).format(`hh`)}h ${moment.utc(this._time.end - this._time.start).format(`mm`)}m</span>
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

  unbind() {
    this._element.removeEventListener(`click`, this._onEditClick);
  }

  update(data) {
    this._type = data.type.name;
    this._icon = data.type.icon;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
  }
}
