export class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.type = data[`type`];
    this.destination = data[`destination`];
    this.isFavorite = data[`is_favorite`];
    this.offers = data[`offers`];
    this.time = {
      start: new Date(data[`date_from`]),
      end: new Date(data[`date_to`])
    };
  }

  toRAW() {
    return {
      'id': this.id,
      'base_price': this.price,
      'type': this.type,
      'destination': this.destination,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'date_from': this.time.start,
      'date_to': this.time.end
    };
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}
