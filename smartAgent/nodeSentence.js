'use strict';

class NodeSentence {
  constructor(sentence, parent, performance) {
    this.sentence = sentence;
    this.parents = [];
    this.children = [];
    this.performance = performance || 0;
    if(parent) {
      this.parents.push(parent);
    }
  }
  addChild(child) {
    this.children.push(child);
  }

  addParent(parent) {
    this.parents.push(parent);
  }

  hasChild() {
    return this.children.length > 0;
  }
}

module.exports = NodeSentence;
