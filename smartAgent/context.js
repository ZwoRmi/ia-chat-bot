'use strict';

class Context {
  constructor (request, response, performance) {
    this.request = request;
    this.response = response;
    this.performance = performance || 0;
  }

  getRequest() {
    return this.request;
  }

  getResponse() {
    return this.response;
  }

  getPerformance() {
    return this.performance;
  }

  setPerformance(newPerformance) {
    this.performance = newPerformance;
    return this;
  }
}

module.exports = Context;