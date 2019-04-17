import Component from './component.js';
import flatpickr from 'flatpickr';
import {typesIcon, additionalData, ERROR_CLASS, ERROR_MESSAGE} from './data.js';
import moment from 'moment';

const ANIMATION_TIMEOUT = 600;

export default class NewPoint extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._offers = data.offers;
    this._time = data.time;
    this._isFavorite = data.isFavorite;
    this._totalPrice = data.totalPrice;

    this._onSubmitClick = this._onSubmitClick.bind(this);
    this._onDeleteClick = this._onDeleteClick.bind(this);
    this._onTypeClick = this._onTypeClick.bind(this);
    this._onDatasetClick = this._onDatasetClick.bind(this);
    this._onButtonPush = this._onButtonPush.bind(this);
    this._onDateChange = this._onDateChange.bind(this);

    this._onSubmit = null;
    this._onDelete = null;
    this._onButton = null;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._formContainer = null;
    this._inputDate = null;
    this._startDate = null;
    this._endDate = null;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onButton(fn) {
    this._onButton = fn;
  }

  get template() {
    return `<article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="Date" name="day" disabled>
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle-${this._id}">${typesIcon[this._type]}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle-${this._id}">

            <div class="travel-way__select">
              <div class="travel-way__select-group">
                ${Object.keys(typesIcon).map((type) => (`
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${type}-${this._id}" name="travel-way" value="${type}" ${this._type === type ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-${type}-${this._id}">${typesIcon[type]} ${type}</label>
                  `.trim())).join(``)}
              </div>
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination-${this._id}">${this._type} to</label>
            <input class="point__destination-input" list="destination-select-${this._id}" id="destination-${this._id}" name="destination" value="" placeholder="${this._destination.name}" required>
            <datalist id="destination-select-${this._id}">
              ${(Array.from(additionalData.destinationsArray).map((destination) => (`
                <option value="${destination.name}"></option>
                `.trim()))).join(``)}
            </datalist>
          </div>

          <div class="point__time">
            choose time
            <input class="point__input" type="text" value="" name="date-start" placeholder="Start" required>
            <input class="point__input" type="text" value="" name="date-end" placeholder="Finish" required>
          </div>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" name="price" required>
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite-${this._id}" name="favorite" ${this._isFavorite ? `checked` : ``}>
            <label class="point__favorite" for="favorite-${this._id}">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>

            <div class="point__offers-wrap">
              ${(Array.from(this._offers).map((offer) => (`
                <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.title.replace(/ /g, `-`).toLowerCase()}-${this._id}" name="offer" value="${offer.title}" ${offer.accepted ? `checked` : ``} >
                <label for="${offer.title.replace(/ /g, `-`).toLowerCase()}-${this._id}" class="point__offers-label">
                  <span class="point__offer-service">${offer.title}</span> +€<span class="point__offer-price">${offer.price}</span>
                </label>`.trim()))).join(``)}
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._destination.description}</p>
            <div class="point__destination-images">
              ${(Array.from(this._destination.pictures).map((picture) => (`
                <img src="${picture.src}" alt="${picture.description}" class="point__destination-image">
                `.trim()))).join(``)}
            </div>
          </section>

          <input type="hidden" class="point__total-price" name="total-price" value="0">
        </section>
      </form>
    </article>`;
  }

  _processForm(formData) {

    const entry = {
      price: 0,
      type: this._type,
      time: {
        start: this._time.start,
        end: this._time.end
      },
      offers: this._offers,
      destination: this._destination,
      isFavorite: false,
      totalPrice: 0
    };

    const pointEditMapper = NewPoint.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (pointEditMapper[property]) {
        if (property === `date-start` || property === `date-end`) {
          if (value === ``) {
            continue;
          } else {
            pointEditMapper[property](value);
          }
        } else if (property === `destination`) {
          if (value === ``) {
            continue;
          } else {
            additionalData.destinationsArray.forEach((item) => {
              if (value === item.name) {
                pointEditMapper[property](item);
              }
            });
          }
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

  _onDeleteClick(evt) {
    evt.preventDefault();

    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
    }
  }

  _onTypeClick(evt) {
    let newOffer = ``;

    additionalData.offersArray.forEach((offer) => {
      if (evt.target.value === offer.type) {
        newOffer = offer;
      }
    });

    if (newOffer === ``) {
      newOffer = {type: evt.target.value};
    } else {
      this._element.querySelector(`.point__offers-wrap`).innerHTML =
      (Array.from(newOffer.offers).map((offer) => (`
        <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.name.replace(/ /g, `-`).toLowerCase()}-${this._id}" name="offer" value="${offer.name}">
        <label for="${offer.name.replace(/ /g, `-`).toLowerCase()}-${this._id}" class="point__offers-label">
          <span class="point__offer-service">${offer.name}</span> +€<span class="point__offer-price">${offer.price}</span>
        </label>`.trim()))).join(``);
    }

    this._element.querySelector(`.travel-way__label`).innerHTML = typesIcon[newOffer.type];
    this._element.querySelector(`.point__destination-label`).innerHTML = newOffer.type + ` to`;
    this._element.querySelector(`.travel-way__toggle`).checked = false;
  }

  _onDatasetClick(evt) {
    let newDestination = ``;

    additionalData.destinationsArray.forEach((destination) => {
      if (evt.target.value === destination.name) {
        newDestination = destination;
      }
    });

    this._element.querySelector(`.point__destination-text`).innerHTML = newDestination.description;
    this._element.querySelector(`.point__destination-images`).innerHTML =
      (Array.from(newDestination.pictures).map((picture) => (`
        <img src="${picture.src}" alt="${picture.description}" class="point__destination-image">
        `.trim()))).join(``);
  }

  _onButtonPush(evt) {
    if (typeof this._onButton === `function`) {
      this._onButton(evt);
    }
  }

  _onDateChange(evt) {
    const value = evt.target.value;

    this._flatpickrEnd.destroy();

    this._flatpickrEnd = flatpickr(this._endDate, {allowInput: true, enableTime: true, altInput: true, altFormat: `H:i`, minDate: value});
    this._inputDate.value = moment(value).format(`MMM D`);
  }

  bind() {
    this._formContainer = this._element.querySelector(`form`);
    this._inputDate = this._element.querySelector(`.point__date input`);
    this._startDate = this._element.querySelector(`.point__time [name="date-start"]`);
    this._endDate = this._element.querySelector(`.point__time [name="date-end"]`);

    this._formContainer.addEventListener(`submit`, this._onSubmitClick);
    this._formContainer.addEventListener(`reset`, this._onDeleteClick);
    window.addEventListener(`keydown`, this._onButtonPush);

    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onTypeClick);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onDatasetClick);

    this._flatpickrStart = flatpickr(this._startDate, {allowInput: true, enableTime: true, altInput: true, altFormat: `H:i`});
    this._flatpickrEnd = flatpickr(this._endDate, {allowInput: true, enableTime: true, altInput: true, altFormat: `H:i`});
    this._startDate.addEventListener(`change`, this._onDateChange);
  }

  unbind() {
    this._formContainer.removeEventListener(`submit`, this._onSubmitClick);
    this._formContainer.removeEventListener(`reset`, this._onDeleteClick);
    window.removeEventListener(`keydown`, this._onButtonPush);

    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onTypeClick);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onDatasetClick);

    this._flatpickrStart.destroy();
    this._flatpickrEnd.destroy();
    this._startDate.removeEventListener(`change`, this._onDateChange);
  }

  update(data) {
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
    this._offers = data.offers;
    this._isFavorite = data.isFavorite;
    this._totalPrice = data.totalPrice;
  }

  block(type) {
    this._element.style.border = `none`;
    if (this._element.querySelector(`.` + ERROR_CLASS)) {
      this._element.querySelector(`.` + ERROR_CLASS).remove();
    }
    this._element.querySelectorAll(`input`).forEach((item) => {
      item.disabled = true;
    });
    this._element.querySelectorAll(`button`).forEach((item) => {
      item.disabled = true;
    });
    if (type === `delete`) {
      this._element.querySelector(`button[type="reset"]`).innerHTML = `Deleting...`;
    } else if (type === `update`) {
      this._element.querySelector(`button[type="submit"]`).innerHTML = `Saving...`;
    }
  }

  unblock(type) {
    this._element.querySelectorAll(`input`).forEach((item) => {
      item.disabled = false;
    });
    this._element.querySelectorAll(`button`).forEach((item) => {
      item.disabled = false;
    });
    if (type === `delete`) {
      this._element.querySelector(`button[type="reset"]`).innerHTML = `Delete`;
    } else if (type === `update`) {
      this._element.querySelector(`button[type="submit"]`).innerHTML = `Save`;
    }
  }

  showError(type) {
    if (!this._element.querySelector(`.` + ERROR_CLASS)) {
      this._element.insertAdjacentHTML(`afterBegin`, ERROR_MESSAGE);
    }
    this._element.style.border = `1px solid red`;
    this.shake();
    this.unblock(type);
  }

  shake() {
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  static createMapper(target) {
    return {
      'price': (value) => {
        target.price = parseInt(value, 10);
      },
      'travel-way': (value) => {
        if (target.type !== value) {
          additionalData.offersArray.forEach((item) => {
            if (value === item.type) {
              target.offers = item.offers;
            }
          });
          target.offers.forEach((offer) => {
            offer.title = offer.name;
            delete offer.name;
          });
          this._offers = target.offers;
        }
        target.offers.forEach((offer) => {
          offer.accepted = false;
        });
        target.type = value;
      },
      'offer': (value) => {
        target.offers.forEach((item) => {
          if (item.title === value) {
            item.accepted = true;
          }
        });
      },
      'destination': (value) => {
        target.destination = value;
      },
      'date-start': (value) => {
        target.time.start = new Date(value);
      },
      'date-end': (value) => {
        target.time.end = new Date(value);
      },
      'favorite': (value) => {
        target.isFavorite = Boolean(value);
      },
      'total-price': () => {
        target.totalPrice = target.offers.reduce((sum, item) => {
          return item.accepted ? sum + item.price : sum;
        }, parseInt(target.price, 10));
      }
    };
  }
}
