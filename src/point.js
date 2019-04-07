import Component from './component.js';
import moment from 'moment';
import {typesIcon} from './data.js';
import {getFullPrice} from './utils.js';

export default class Point extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._offers = data.offers;
    this._time = data.time;

    this._onEdit = null;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${typesIcon[this._type]}</i>
          <h3 class="trip-point__title">${this._type.charAt(0).toUpperCase() + this._type.slice(1)} to ${this._destination.name}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${moment(this._time.start).format(`HH:mm`)}&nbsp;&mdash; ${moment(this._time.end).format(`HH:mm`)}</span>
            <span class="trip-point__duration">${moment.utc(this._time.end - this._time.start).format(`hh`)}h ${moment.utc(this._time.end - this._time.start).format(`mm`)}m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${getFullPrice(this._price, this._offers)}</p>
          <ul class="trip-point__offers">
            ${(Array.from(this._offers).map((offer) => (offer.accepted ? `
              <li>
                <button class="trip-point__offer">${offer.title} (&euro;&nbsp;${offer.price})</button>
              </li>
              ` : `
              <li>
                <button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button>
              </li>
              `.trim()))).join(``)}
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
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._offers = data.offers;
    this._time = data.time;
  }
}
