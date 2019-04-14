export const typesIcon = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🛳️`,
  'transport': `🚊`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛️`,
  'restaurant': `🍴`};

export let destinationsArray = [];

export let offersArray = [];

export const filters = [
  {name: `everything`, checked: true},
  {name: `future`, checked: false},
  {name: `past`, checked: false}
];

export const sorts = [
  {name: `event`, checked: true},
  {name: `time`, checked: false},
  {name: `price`, checked: false}
];

export const writeDestinations = (data) => {
  destinationsArray = data;
};

export const writeOffers = (data) => {
  offersArray = data;
};
