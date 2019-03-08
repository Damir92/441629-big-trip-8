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

const makeOffersList = (offersArray) => {
  let templateOfOffers = ``;

  offersArray.forEach((item) => {
    templateOfOffers += `<li>
              <button class="trip-point__offer">${item.name} +&euro;&nbsp;${item.price}</button>
            </li>`;
  });

  return templateOfOffers;
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
            <span class="trip-point__timetable">${makeTime(data.time.start)}&nbsp;&mdash; ${makeTime(data.time.end)}</span>
            <span class="trip-point__duration">${(data.time.end - data.time.start) / 60 / 60 / 1000}h 00m</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${data.price}</p>
          <ul class="trip-point__offers">
            ${makeOffersList(data.offers)}
          </ul>
        </article>`;
