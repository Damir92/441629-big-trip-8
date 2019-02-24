const FILTERS_NAME = [`everything`, `future`, `past`];

const tripFilter = document.querySelector(`.trip-filter`);

const makeFilter = (name, isChecked = false) => `<input
          type="radio"
          id="filter-${name}"
          name="filter"
          value="${name}"
          ${ isChecked ? `checked` : `` }
        />
        <label class="trip-filter__item"
        for="filter-${name}">
          ${name}
        </label>`;

FILTERS_NAME.forEach((elem, index) => {
  tripFilter.insertAdjacentHTML(`beforeEnd`, makeFilter(elem, index === 0));
});

export {tripFilter};
