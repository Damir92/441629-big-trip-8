import {tripFilter} from './make-filter.js';
import getRandomPoint from './data.js';
import Point from './point.js';
import PointEdit from './point-edit.js';

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

  for (let item of arrayOfPoints) {
    const pointComponent = new Point(item);
    const editPointComponent = new PointEdit(item);

    tripItem.appendChild(pointComponent.render());

    pointComponent.onEdit = () => {
      editPointComponent.render();
      tripItem.replaceChild(editPointComponent.element, pointComponent.element);
      pointComponent.unrender();
    };

    editPointComponent.onSubmit = () => {
      pointComponent.render();
      tripItem.replaceChild(pointComponent.element, editPointComponent.element);
      editPointComponent.unrender();
    };

    editPointComponent.onReset = () => {
      pointComponent.render();
      tripItem.replaceChild(pointComponent.element, editPointComponent.element);
      editPointComponent.unrender();
    };
  }
  // for (let i = 0; i < count; i++) {
  //   // template += makePoint(arrayOfPoints[i]);
  //   const pointComponent = new Point()
  // }


  tripItem.insertAdjacentHTML(`beforeEnd`, template);
};

tripFilter.querySelectorAll(`input`).forEach((elem) => {
  elem.addEventListener(`click`, function () {
    makeTrip(Math.ceil(Math.random() * TEMP_MAX));
  });
});

makeTrip(7);
