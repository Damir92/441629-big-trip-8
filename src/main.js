import getRandomPoint, {filters} from './data.js';
import Filter from './filter.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import {createMoneyChart, createTransportChart, createTimeSpendChart} from './stat.js';
import {filterPoint} from './utils.js';

const TEMP_MAX = 7;
const tripItem = document.querySelector(`.trip-day__items`);

const removeTrip = () => {
  tripItem.querySelectorAll(`article`).forEach((elem) => {
    elem.remove();
  });
};

const getFilterName = () => {
  return document.querySelector(`.trip-filter input:checked`).value;
};

const makeFilter = (points, filtersArr) => {
  const tripFilter = document.querySelector(`.trip-filter`);
  tripFilter.innerHTML = ``;

  for (let filter of filtersArr) {
    const filterComponent = new Filter(filter);
    tripFilter.appendChild(filterComponent.render());

    filterComponent.onFilter = () => {
      let filteredPoints = [];
      for (let item of points) {
        if (filterPoint(item, filterComponent._name)) {
          filteredPoints.push(item);
        }
      }
      makeTrip(filteredPoints);
    };

  }
};

const makeTrip = (arrayOfPoints) => {
  removeTrip();

  for (let item of arrayOfPoints) {
    const pointComponent = new Point(item);
    const editPointComponent = new PointEdit(item);

    tripItem.appendChild(pointComponent.render());

    pointComponent.onEdit = () => {
      editPointComponent.render();
      tripItem.replaceChild(editPointComponent.element, pointComponent.element);
      pointComponent.unrender();
    };

    editPointComponent.onSubmit = (newObject) => {
      item.type = newObject.type;
      item.time = newObject.time;
      item.price = newObject.price;
      item.offers = newObject.offers;

      pointComponent.update(item);
      if (filterPoint(item, getFilterName())) {
        pointComponent.render();
        tripItem.replaceChild(pointComponent.element, editPointComponent.element);
      }
      editPointComponent.unrender();
    };

    editPointComponent.onDelete = () => {
      editPointComponent.unrender();
      arrayOfPoints.splice(arrayOfPoints.indexOf(item), 1);
    };
  }
};

const statButton = document.querySelector(`[href="#stats"]`);
const tableButton = document.querySelector(`[href="#table"]`);

const mainContainer = document.querySelector(`main`);
const statContainer = document.querySelector(`.statistic`);

const createDataForStat = (points) => {
  let result = [[], [], [], [], []];
  for (let item of points) {
    let index = result[0].indexOf(item.type.name);
    if (index === -1) {
      let newIndex = result[0].length;
      result[0][newIndex] = item.type.name;
      result[1][newIndex] = item.type.icon + ` ` + item.type.name.toUpperCase();
      result[2][newIndex] = item.price;
      result[3][newIndex] = 1;
      result[4][newIndex] = Math.round((item.time.end - item.time.start) / 60 / 60 / 1000);
    } else {
      result[2][index] += item.price;
      result[3][index] += 1;
      result[4][index] += Math.round((item.time.end - item.time.start) / 60 / 60 / 1000);
    }
  }
  return result;
};

const makeStats = () => {
  const dataForStat = createDataForStat(arrayOfPoints);
  createMoneyChart(dataForStat);
  createTransportChart(dataForStat);
  createTimeSpendChart(dataForStat);
};

statButton.addEventListener(`click`, () => {
  mainContainer.classList.add(`visually-hidden`);
  statButton.classList.add(`view-switch__item--active`);
  statContainer.classList.remove(`visually-hidden`);
  tableButton.classList.remove(`view-switch__item--active`);
  makeStats();
});

tableButton.addEventListener(`click`, () => {
  statContainer.classList.add(`visually-hidden`);
  tableButton.classList.add(`view-switch__item--active`);
  mainContainer.classList.remove(`visually-hidden`);
  statButton.classList.remove(`view-switch__item--active`);
});

let arrayOfPoints = [];

for (let i = 0; i < TEMP_MAX; i++) {
  arrayOfPoints[i] = getRandomPoint();
}

makeFilter(arrayOfPoints, filters);

makeTrip(arrayOfPoints);
