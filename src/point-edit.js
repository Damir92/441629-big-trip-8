import Component from './component.js';
import flatpickr from 'flatpickr';
import {typesIcon, destinationsArray, offersArray} from './data.js';
import moment from 'moment';

export default class PointEdit extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._offers = data.offers;
    this._time = data.time;
    this._isFavorite = data.isFavorite;

    this._onSubmitClick = this._onSubmitClick.bind(this);
    this._onDeleteClick = this._onDeleteClick.bind(this);
    this._onTypeClick = this._onTypeClick.bind(this);
    this._onDatasetClick = this._onDatasetClick.bind(this);

    this._onSubmit = null;
    this._onDelete = null;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;
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
      isFavorite: false
    };

    const pointEditMapper = PointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      console.log(property, value);

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
            destinationsArray.forEach((item) => {
              if (value === item.name) {
                pointEditMapper[property](item);
              }
            });
          }
        // } else if (property === `favorite`) {
        //   pointEditMapper[property](value);
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

    offersArray.forEach((offer) => {
      if (evt.target.value === offer.type) {
        newOffer = offer;
      }
    });

    this._element.querySelector(`.travel-way__label`).innerHTML = typesIcon[newOffer.type];
    this._element.querySelector(`.point__destination-label`).innerHTML = newOffer.type;
    this._element.querySelector(`.travel-way__toggle`).checked = false;
    this._element.querySelector(`.point__offers-wrap`).innerHTML =
      (Array.from(newOffer.offers).map((offer) => (`
        <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.name.replace(/ /g, `-`).toLowerCase()}" name="offer" value="${offer.name}">
        <label for="${offer.name.replace(/ /g, `-`).toLowerCase()}" class="point__offers-label">
          <span class="point__offer-service">${offer.name}</span> +€<span class="point__offer-price">${offer.price}</span>
        </label>`.trim()))).join(``);
  }

  _onDatasetClick(evt) {
    let newDestination = ``;

    destinationsArray.forEach((destination) => {
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

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
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
            <label class="travel-way__label" for="travel-way__toggle">${typesIcon[this._type]}</label>

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
            <label class="point__destination-label" for="destination">${this._type} to</label>
            <input class="point__destination-input" list="destination-select" id="destination" name="destination" value="" placeholder="${this._destination.name}">
            <datalist id="destination-select">
              ${(Array.from(destinationsArray).map((destination) => (`
                <option value="${destination.name}"></option>
                `.trim()))).join(``)}
            </datalist>
          </div>

          <div class="point__time">
            choose time
            <input class="point__input" type="text" value="" name="date-start" placeholder="${moment(this._time.start).format(`HH:mm`)}">
            <input class="point__input" type="text" value="" name="date-end" placeholder="${moment(this._time.end).format(`HH:mm`)}">
          </div>

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
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
            <label class="point__favorite" for="favorite">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>

            <div class="point__offers-wrap">
              ${(Array.from(this._offers).map((offer) => (`
                <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.title.replace(/ /g, `-`).toLowerCase()}" name="offer" value="${offer.title}" ${offer.accepted ? `checked` : ``} >
                <label for="${offer.title.replace(/ /g, `-`).toLowerCase()}" class="point__offers-label">
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
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`;
  }

  bind() {
    const form = this._element.querySelector(`form`);

    form.addEventListener(`submit`, this._onSubmitClick);

    form.addEventListener(`reset`, this._onDeleteClick);

    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onTypeClick);

    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onDatasetClick);

    this._flatpickrStart = flatpickr(this._element.querySelector(`.point__time [name="date-start"]`), {enableTime: true, altInput: true, altFormat: `H:i`});
    this._flatpickrEnd = flatpickr(this._element.querySelector(`.point__time [name="date-end"]`), {enableTime: true, altInput: true, altFormat: `H:i`});
  }

  unbind() {
    const form = this._element.querySelector(`form`);

    form.removeEventListener(`submit`, this._onSubmitClick);

    form.removeEventListener(`reset`, this._onDeleteClick);

    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onTypeClick);

    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onDatasetClick);

    this._flatpickrStart.destroy();
    this._flatpickrEnd.destroy();
  }

  update(data) {
    this._price = data.price;
    this._type = data.type;
    this._destination = data.destination;
    this._time = data.time;
    this._offers = data.offers;
    this._isFavorite = data.isFavorite
  }

  block() {
    this._element.querySelectorAll(`input`).forEach((item) => {
      item.disabled = true;
    });
    this._element.querySelectorAll(`button`).forEach((item) => {
      item.disabled = true;
    });
    this._element.querySelector(`button[type="reset"]`).innerHTML = 'Deleting...';
  }

  unblock() {
    this._element.querySelectorAll(`input`).forEach((item) => {
      item.disabled = false;
    });
    this._element.querySelectorAll(`button`).forEach((item) => {
      item.disabled = false;
    });
    this._element.querySelector(`button[type="reset"]`).innerHTML = 'Delete';
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`

    setTimeout(() => {
      this._element.style.animation = ``
    }, ANIMATION_TIMEOUT);
  }

  static createMapper(target) {
    return {
      'price': (value) => {
        target.price = value;
      },
      'travel-way': (value) => {
        if (target.type !== value) {
          offersArray.forEach((item) => {
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
      }
    };
  }
}
