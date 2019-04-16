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
// export const typesIcon = [
//   { name: 'taxi', icon: `🚕` },
//   { name: 'bus', icon: `🚌` },
//   { name: 'train', icon: `🚂` },
//   { name: 'ship', icon: `🛳️` },
//   { name: 'transport', icon: `🚊` },
//   { name: 'drive', icon: `🚗`},
//   { name: 'flight', icon: `✈️` },
//   { name: 'check-in', icon: `🏨`},
//   { name: 'sightseeing', icon: `🏛️`},
//   { name: 'restaurant', icon: `🍴` }
// ];

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
