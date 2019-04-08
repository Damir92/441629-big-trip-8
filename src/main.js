import {filters, typesIcon, writeDestinations, writeOffers} from './data.js';
import Filter from './filter.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import {API} from './api.js';
import {createMoneyChart, createTransportChart, createTimeSpendChart} from './stat.js';
import {filterPoint} from './utils.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd37yZAo`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

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
      item.price = newObject.price;
      item.type = newObject.type;
      item.destination = newObject.destination;
      item.isFavorite = newObject.isFavorite;
      item.offers = newObject.offers;
      item.time = newObject.time;

      pointComponent.update(item);
      if (filterPoint(item, getFilterName())) {
        pointComponent.render();
        tripItem.replaceChild(pointComponent.element, editPointComponent.element);
      }
      editPointComponent.unrender();
    };

    editPointComponent.onDelete = ({id}) => {
      const block = () => {
        editPointComponent.element.querySelectorAll(`input`).forEach((item) => {
          item.disabled = true;
        });
        editPointComponent.element.querySelectorAll(`button`).forEach((item) => {
          item.disabled = true;
        });
        editPointComponent.element.querySelector(`button[type="reset"]`).innerHTML = 'Deleting...';
      }

      const unblock = () => {
        editPointComponent.element.querySelectorAll(`input`).forEach((item) => {
          item.disabled = false;
        });
        editPointComponent.element.querySelectorAll(`button`).forEach((item) => {
          item.disabled = false;
        });
        editPointComponent.element.querySelector(`button[type="reset"]`).innerHTML = 'Delete';
      }

      block();

      api.deletePoint({id})
        .then(() => api.getPoints())
        .then((points) => {
          arrayOfPoints = points;
          makeTrip(arrayOfPoints);
        })
        .catch(() => {
          editPointComponent.element.style.border = '1px solid red';
          editPointComponent.shake();
          unblock();
        });
      // editPointComponent.unrender();
      // arrayOfPoints.splice(arrayOfPoints.indexOf(item), 1);
    };
  }
};

const statButton = document.querySelector(`[href="#stats"]`);
const tableButton = document.querySelector(`[href="#table"]`);

const mainContainer = document.querySelector(`main`);
const statContainer = document.querySelector(`.statistic`);

const createDataForStat = (points) => {
  let result = {
    type: [],
    legend: [],
    price: [],
    count: [],
    time: []
  };
  for (let item of points) {
    let index = result.type.indexOf(item.type);
    if (index === -1) {
      let newIndex = result.type.length;
      result.type[newIndex] = item.type;
      result.legend[newIndex] = typesIcon[item.type] + ` ` + item.type.toUpperCase();
      result.price[newIndex] = item.price;
      result.count[newIndex] = 1;
      result.time[newIndex] = Math.round((item.time.end - item.time.start) / 60 / 60 / 1000);
    } else {
      result.price[index] += item.price;
      result.count[index] += 1;
      result.time[index] += Math.round((item.time.end - item.time.start) / 60 / 60 / 1000);
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

api.getDestinations()
  .then((data) => {
    writeDestinations(data);
  });

api.getOffers()
  .then((data) => {
    writeOffers(data);
  });

api.getPoints()
  .then((points) => {
    arrayOfPoints = points;
    makeFilter(arrayOfPoints, filters);

    makeTrip(arrayOfPoints);
  });

