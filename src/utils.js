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

export const getFullPrice = (price, offers) => {
  let fullPrice = parseInt(price, 10);
  offers.forEach(function (offer) {
    if (offer.accepted) {
      fullPrice += parseInt(offer.price, 10);
    }
  });
  return fullPrice;
};
