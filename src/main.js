import {filters, sorts, typesIcon, writeDestinations, writeOffers} from './data.js';
import Filter from './filter.js';
import Sort from './sort.js';
import TotalPrice from './total-price.js';
import Day from './day.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import NewPoint from './new-point.js';
import NewModel from './model-new-point.js';
import {API} from './api.js';
import {createMoneyChart, createTransportChart, createTimeSpendChart} from './stat.js';
import {filterPoint, sortPoint, calcPrice, getNewPoint} from './utils.js';
import moment from 'moment';

const AUTHORIZATION = `Basic dXNlckBwYXNzd37yZAsdf=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const tripTotal = document.querySelector(`.trip__total`);
const trip = document.querySelector(`.trip-points`);

const removeTrip = () => {
  trip.querySelectorAll(`section`).forEach((elem) => {
    elem.remove();
  });
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
      sortTrip(filteredPoints, sorts);
      makeTrip(filteredPoints);
    };

  }
};

const sortTrip = (points, sortsArray) => {
  const tripSort = document.querySelector(`.trip-sorting`);
  tripSort.innerHTML = ``;

  for (let sort of sortsArray) {
    const sortComponent = new Sort(sort);
    tripSort.appendChild(sortComponent.render());

    sortComponent.onSort = () => {
      makeTrip(sortPoint(points, sortComponent._name));
    };
  }
};

const makeTrip = (arrayOfItems) => {
  removeTrip();

  tripTotal.innerHTML = ``;
  let totalPriceComponent = new TotalPrice(calcPrice(arrayOfPoints));
  tripTotal.appendChild(totalPriceComponent.render());

  const updatePrice = (array) => {
    totalPriceComponent.unrender();
    totalPriceComponent = new TotalPrice(calcPrice(array));
    tripTotal.appendChild(totalPriceComponent.render());
  };

  let day = ``;
  let dayNumber = 0;
  let tripDay = trip;
  let dayComponent = ``;

  for (let item of arrayOfItems) {

    if (moment(item.time.start).format(`MMM D`) !== day) {
      day = moment(item.time.start).format(`MMM D`);
      dayComponent = new Day({number: ++dayNumber, date: day});
      trip.appendChild(dayComponent.render());
      tripDay = dayComponent.element.querySelector(`.trip-day__items`);
    }
    let dayComponentClone = dayComponent;
    let tripItem = tripDay;
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
      item.totalPrice = newObject.totalPrice;

      editPointComponent.block(`update`);

      api.updatePoint({id: item.id, data: item.toRAW()})
        .then(() => api.getPoints())
        .then((points) => {
          arrayOfPoints = points.sort((a, b) => {
            return a.time.start - b.time.start;
          });
          updatePrice(arrayOfPoints);
          makeTrip(arrayOfPoints);
        })
        .catch(() => {
          editPointComponent.error(`update`);
        });
    };

    editPointComponent.onDelete = ({id}) => {
      editPointComponent.block(`delete`);

      api.deletePoint({id})
        .then(() => api.getPoints())
        .then((points) => {
          arrayOfPoints = points;
          if (tripItem.childElementCount === 1) {
            dayComponentClone.unrender();
          } else {
            editPointComponent.unrender();
          }
          updatePrice(arrayOfPoints);
        })
        .catch(() => {
          editPointComponent.error(`delete`);
        });
    };

    editPointComponent.onButton = (evt) => {
      if (evt.keyCode === 27) {
        pointComponent.render();
        tripItem.replaceChild(pointComponent.element, editPointComponent.element);
        editPointComponent.unrender();
      }
    };
  }
};

document.querySelector(`.trip-controls__new-event`).addEventListener(`click`, () => {
  let newPoint = getNewPoint(arrayOfPoints);
  const newPointComponent = new NewPoint(newPoint);
  trip.insertBefore(newPointComponent.render(), trip.firstChild);

  newPointComponent.onSubmit = (newObject) => {
    let item = new NewModel(newObject);
    item.price = newObject.price;
    item.type = newObject.type;
    item.destination = newObject.destination;
    item.isFavorite = newObject.isFavorite;
    item.offers = newObject.offers;
    item.time = newObject.time;
    item.totalPrice = newObject.totalPrice;

    newPointComponent.block(`update`);

    api.createPoint({point: item.toRAW()})
      .then(() => api.getPoints())
      .then((points) => {
        arrayOfPoints = points.sort((a, b) => {
          return a.time.start - b.time.start;
        });
        trip.innerHTML = ``;
        makeTrip(arrayOfPoints);
      })
      .catch(() => {
        newPointComponent.error(`update`);
      });
  };

  newPointComponent.onDelete = () => {
    newPointComponent.unrender();
  };

  newPointComponent.onButton = (evt) => {
    if (evt.keyCode === 27) {
      newPointComponent.unrender();
    }
  };
});

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
      result.price[newIndex] = parseInt(item.price, 10);
      result.count[newIndex] = 1;
      result.time[newIndex] = Math.round((item.time.end - item.time.start) / 60 / 60 / 1000);
    } else {
      result.price[index] += parseInt(item.price, 10);
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

trip.innerHTML = `Loading route...`;

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
    arrayOfPoints = points.sort((a, b) => {
      return a.time.start - b.time.start;
    });
    makeFilter(arrayOfPoints, filters);
    sortTrip(arrayOfPoints, sorts);

    trip.innerHTML = ``;
    makeTrip(arrayOfPoints);
  })
  .catch(() => {
    trip.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
  });
