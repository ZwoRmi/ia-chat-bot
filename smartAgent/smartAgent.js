'use strict';

const Context = require('./context');

class SmartAgent {
  constructor() {
    this.contexts = [];
  }

  addContext (request, response, performance) {
    this.contexts.push(new Context(request, response, performance));
  }

  getResponse(request) {
    let possibleContextResponses = this.getPossibleContextResponses(request);
    return this.getBestResponse(request, possibleContextResponses);
  }

  getBestResponse(request, possibleContextResponses) {
    let response = 'Je ne sais pas quoi répondre';
    let maxPerf = -1;
    if (possibleContextResponses.length > 0) {
      possibleContextResponses.forEach(function(possibleContextResponse) {
        if (possibleContextResponse.getPerformance()>maxPerf) {
          response = possibleContextResponse.getResponse();
          maxPerf = possibleContextResponse.getPerformance();
        }
      });
    }
    if (maxPerf === -1 && typeof this.getContext(request, response) === 'undefined') {
      this.addContext(request, response, 0);
    }
    return response;
  }

  getPossibleContextResponses(request) {
    let possibleContextResponses = [];
    this.contexts.forEach(function(context) {
      if(context.request === request) {
        possibleContextResponses.push(context);
      }
    });
    return possibleContextResponses;
  }

  increasePerformance(request, response) {
    let context = this.getContext(request, response);
    context.setPerformance(context.getPerformance() + 1)
  }

  decreasePerformance(request, response) {
    let context = this.getContext(request, response);
    context.setPerformance(context.getPerformance() - 1)
  }

  getContext(request, response) {
    let i = 0;
    let found = false;
    let result = undefined;
    while(i<this.contexts.length && !found) {
      if (this.contexts[i].getRequest() === request && this.contexts[i].getResponse() === response) {
        found = true;
        result = this.contexts[i];
      }
      i++;
    }
    return result;
  }
}

module.exports = new SmartAgent;