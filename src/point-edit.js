import Component from './component.js';
import flatpickr from 'flatpickr';
import {typesIcon} from './data.js';
import moment from 'moment';

export default class PointEdit extends Component {
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

    this._onSubmitClick = this._onSubmitClick.bind(this);
    this._onResetClick = this._onResetClick.bind(this);
    this._onTypeClick = this._onTypeClick.bind(this);

    this._onSubmit = null;
    this._onReset = null;

    this._flatpickrTime = null;
  }

  _processForm(formData) {
    const entry = {
      type: {
        name: this._type,
        icon: this._icon
      },
      time: {
        start: new Date(),
        end: new Date()
      },
      price: 0,
      offers: []
    };

    const pointEditMapper = PointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (pointEditMapper[property]) {
        if (property === `time`) {
          if (value === ``) {
            pointEditMapper[property](this._time);
          } else {
            const timeArr = value.split(` — `);
            if (timeArr[0] === `` || timeArr[1] === ``) {
              pointEditMapper[property](this._time);
            } else {
              const time = {
                start: timeArr[0],
                end: timeArr[1]
              };
              pointEditMapper[property](time);
            }
          }
          continue;
        } else if (property === `offer`) {
          this._offers.forEach((offer) => {
            if (offer.name === value) {
              pointEditMapper[property](offer);
            }
          });
        } else {
          pointEditMapper[property](value);
        }
      }
    }

    return entry;
  }

  _onSubmitClick(evt) {
    evt.preventDefault();

    const formData = new FormData(this._element.querySelector(`form`));
    const newData = this._processForm(formData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  _onResetClick(evt) {
    evt.preventDefault();
    if (typeof this._onReset === `function`) {
      this._onReset();
    }
  }

  _onTypeClick(evt) {
    const newType = evt.target.value;

    this._element.querySelector(`.travel-way__label`).innerHTML = typesIcon[newType];
    this._element.querySelector(`.point__destination-label`).innerHTML = newType;
    this._element.querySelector(`.travel-way__toggle`).checked = false;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onReset(fn) {
    this._onReset = fn;
  }

  get template() {
    return `<article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="MAR 18" name="day">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${this._icon}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

            <div class="travel-way__select">
              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi" ${this._type === `taxi` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus" ${this._type === `bus` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train" ${this._type === `train` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight" ${this._type === `flight` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
              </div>

              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in" ${this._type === `check-in` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing" ${this._type === `sight-seeing` ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
              </div>
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">${this._type}</label>
            <input class="point__destination-input" list="destination-select" id="destination" name="destination" value="">
            <datalist id="destination-select">
              <option value="airport"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="hotel"></option>
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="" name="time" placeholder="${moment(this._time.start).format(`HH:mm`)}&nbsp;&mdash; ${moment(this._time.end).format(`HH:mm`)}">
          </label>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._price}" name="price">
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
            <label class="point__favorite" for="favorite">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>

            <div class="point__offers-wrap">
              ${(Array.from(this._offers).map((offer) => (`
                <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.name.replace(/ /g, `-`).toLowerCase()}" name="offer" value="${offer.name}" checked >
                <label for="${offer.name.replace(/ /g, `-`).toLowerCase()}" class="point__offers-label">
                  <span class="point__offer-service">${offer.name}</span> + €<span class="point__offer-price">${offer.price}</span>
                </label>`.trim()))).join(``)}
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._description}</p>
            <div class="point__destination-images">
              <img src="${this._photo}" alt="picture from place" class="point__destination-image">
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`;
  }

  bind() {
    const form = this._element.querySelector(`form`);

    form.addEventListener(`submit`, this._onSubmitClick);

    form.addEventListener(`reset`, this._onResetClick);

    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onTypeClick);

    this._flatpickrTime = flatpickr(this._element.querySelector(`.point__time .point__input`), {enableTime: true, altInput: true, mode: `range`, altFormat: `H:i`, locale: {rangeSeparator: ` — `}});
  }

  unbind() {
    const form = this._element.querySelector(`form`);

    form.removeEventListener(`submit`, this._onSubmitClick);

    form.removeEventListener(`reset`, this._onResetClick);

    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onTypeClick);

    this._flatpickrTime.destroy();
  }

  update(data) {
    this._type = data.type.name;
    this._icon = data.type.icon;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
  }

  static createMapper(target) {
    return {
      'offer': (value) => target.offers.push(value),
      'travel-way': (value) => {
        target.type.name = value;
        target.type.icon = typesIcon[value];
      },
      'time': (value) => {
        target.time.start = new Date(value.start);
        target.time.end = new Date(value.end);
      },
      'price': (value) => {
        target.price = value;
      }
    };
  }
}
