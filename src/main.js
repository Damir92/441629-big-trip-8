import {tripFilter} from './make-filter.js';
import makePoint from './make-point.js';
import getRandomPoint from './data.js';

const TEMP_MAX = 7;
const tripItem = document.querySelector(`.trip-day__items`);

const removeTrip = () => {
  tripItem.querySelectorAll(`article`).forEach((elem) => {
    elem.remove();
  });
};

const makeTrip = (count) => {
  removeTrip();

  let template = ``;
  let arrayOfPoints = [];

  for (let i = 0; i < count; i++) {
    arrayOfPoints[i] = getRandomPoint();
  }

  for (let i = 0; i < count; i++) {
    template += makePoint(arrayOfPoints[i]);
  }

  tripItem.insertAdjacentHTML(`beforeEnd`, template);
};

tripFilter.querySelectorAll(`input`).forEach((elem) => {
  elem.addEventListener(`click`, function () {
    makeTrip(Math.ceil(Math.random() * TEMP_MAX));
  });
});

makeTrip(7);
