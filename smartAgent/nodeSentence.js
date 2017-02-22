'use strict';

class NodeSentence {
  constructor(sentence, performance) {
    this['sentence'] = sentence;
    this.children = [];
    this.performance = performance || 0;
  }
}

module.exports = NodeSentence;
