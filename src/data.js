const typesName = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `checkin`, `sightseeing`, `restaurant`];
const cities = [`Amsterdam`, `Geneva`, `Chamonix`, `Geneva`, `Amsterdam`];
const offers = new Set([`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`]);
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

export const getRandomPrice = (maxPrice, round) => getRandom(maxPrice / round) * round;

const getRandomDate = () => Date.now() + getRandom(10 * 24) * 60 * 60 * 1000;

const getOffers = (offersArray) => {
  let setOfOffers = new Set();

  for (let index = 0; index < 2; index++) {
    setOfOffers.add([...offersArray][getRandom(offersArray.size)]);
  }

  return setOfOffers;
};

const getRandomDescription = (desc) => {
  let description = ``;

  for (let index = 0; index < getRandom(2) + 1; index++) {
    description += descriptions[getRandom(desc.length)];
  }

  return description;
};

export default () => ({
  type: typesName[getRandom(typesName.length)],
  cities,
  offers: getOffers(offers),
  description: getRandomDescription(descriptions),
  startTime: new Date(getRandomDate()),
  price: getRandomPrice(100, 10),
  duration: getRandom(10)
});
