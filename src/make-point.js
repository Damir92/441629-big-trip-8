import {getRandom, getRandomPrice} from './data.js';

const types = {
  taxi: `🚕`,
  bus: `🚌`,
  train: `🚂`,
  ship: `🛳️`,
  transport: `🚊`,
  drive: `🚗`,
  flight: `✈️`,
  checkin: `🏨`,
  sightseeing: `🏛️`,
  restaurant: `🍴`};

const makeOffersList = (offers) => {
  let templateOfOffers = ``;

  for (let offer of offers) {
    templateOfOffers += `<li>
              <button class="trip-point__offer">${offer} +&euro;&nbsp;${getRandomPrice(100, 10)}</button>
            </li>`;
  }

  return templateOfOffers;
};

const makeFinishTime = (startTime) => {
  return new Date(Date.parse(startTime) + (getRandom(10) + 1) * 60 * 60 * 1000);
};

const makeTime = (date) => {
  const hours = date.getHours() < 10 ? `0` + date.getHours() : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0` + date.getMinutes() : date.getMinutes();
  return hours + `:` + minutes;
};

export default (data) => `<article class="trip-point">
          <i class="trip-icon">${types[data.type]}</i>
          <h3 class="trip-point__title">${data.type}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${makeTime(data.startTime)}&nbsp;&mdash; ${makeTime(makeFinishTime(data.startTime))}</span>
            <span class="trip-point__duration">${data.duration}h 00m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${data.price}</p>
          <ul class="trip-point__offers">
            ${makeOffersList(data.offers)}
          </ul>
        </article>`;
