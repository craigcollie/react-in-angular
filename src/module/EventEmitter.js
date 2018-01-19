class EventEmitter {
  constructor() {
    this.events = {};
  }
  dispatch(event, newValues) {
    if (event in this.events) {
      this.events[event].apply(null, [newValues]);
    }
  }
  on = (event, fn) => (this.events[event] = fn);
}

export default EventEmitter;
