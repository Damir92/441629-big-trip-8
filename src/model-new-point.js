export default class NewModel {
  constructor(data) {
    this.id = data.id;
    this.price = +data.price;
    this.type = data.type;
    this.destination = data.destination;
    this.isFavorite = data.isFavorite;
    this.offers = data.offers;
    this.time = data.time;
  }

  toRAW() {
    return {
      'id': this.id,
      'base_price': this.price,
      'type': this.type,
      'destination': this.destination,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'date_from': new Date(this.time.start).getTime(),
      'date_to': new Date(this.time.end).getTime()
    };
  }
}
