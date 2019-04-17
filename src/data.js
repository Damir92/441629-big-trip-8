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

export const ERROR_CLASS = `error_message`;

export const ERROR_MESSAGE = `<div class="${ERROR_CLASS}" style="text-align: center; padding: 10px;">Something went wrong while loading your route info. Check your connection or try again later</div>`;

export const additionalData = {
  destinationsArray: [],
  offersArray: []
};

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
  additionalData.destinationsArray = data;
};

export const writeOffers = (data) => {
  additionalData.offersArray = data;
};
