const typesName = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `checkin`, `sightseeing`, `restaurant`];
const typesIcon = {
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
const cities = [`Amsterdam`, `Geneva`, `Chamonix`, `Geneva`, `Amsterdam`];
const offers = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];
const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`];

export const getRandom = (length) => Math.floor(Math.random() * length);

const getRandomPrice = (maxPrice, round) => (getRandom(maxPrice / round) + 1) * round;

const getRandomDate = () => {
  const startDate = Date.now() + getRandom(10 * 24) * 60 * 60 * 1000;
  const finishDate = startDate + getRandom(10) * 60 * 60 * 1000;

  return {
    start: new Date(startDate),
    end: new Date(finishDate)
  };
};

const getType = () => {
  const nameOfType = typesName[getRandom(typesName.length)];

  return {name: nameOfType, icon: typesIcon[nameOfType]};
};

const getOffers = (offersArray) => {
  let setOfOffers = new Set();
  let offersOfPoint = [];

  for (let index = 0; index < 2; index++) {
    setOfOffers.add(offersArray[getRandom(offersArray.length)]);
  }

  for (let offer of setOfOffers) {
    offersOfPoint.push({name: offer, price: getRandomPrice(100, 10)});
  }

  return offersOfPoint;
};

const getRandomDescription = (desc) => {
  let description = ``;

  for (let index = 0; index < getRandom(2) + 1; index++) {
    description += descriptions[getRandom(desc.length)];
  }

  return description;
};

export default () => ({
  type: getType(),
  cities,
  offers: getOffers(offers),
  description: getRandomDescription(descriptions),
  time: getRandomDate(),
  price: getRandomPrice(100, 10),
  photo: `//picsum.photos/300/150?r=${Math.random()}`
});
