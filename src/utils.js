export const makeTime = (date) => {
  const hours = date.getHours() < 10 ? `0` + date.getHours() : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0` + date.getMinutes() : date.getMinutes();
  return hours + `:` + minutes;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const filterPoint = (point, filter) => {
  switch (filter) {
    case `everything`:
      return true;

    case `future`:
      return Date.now() < point.time.start;

    case `past`:
      return Date.now() > point.time.start;

    default:
      return true;
  }
};

export const sortPoint = (array, sortName) => {
  switch (sortName) {
    case `event`:
      return array.sort((a, b) => {
        return a.time.start - b.time.start;
      });

    case `time`:
      return array.sort((a, b) => {
        return (b.time.end - b.time.start) - (a.time.end - a.time.start);
      });

    case `price`:
      return array.sort((a, b) => {
        return b.totalPrice - a.totalPrice;
      });

    default:
      return array;
  }
};

export const calcPrice = (array) => {
  let result = 0;
  for (let item of array) {
    result += item.offers.reduce((sum, offer) => {
      return offer.accepted ? sum + parseInt(offer.price, 10) : sum;
    }, parseInt(item.price, 10));
  }
  return result;
};
