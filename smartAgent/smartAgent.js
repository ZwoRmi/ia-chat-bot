'use strict';

const NodeSentence = require('./nodeSentence');

function shuffle(a) {
  let j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

function removePunctuation(sentence) {
  return sentence.replace(/[^A-Za-z0-9_]/g,"");
}

class SmartAgent {
  constructor() {
    this.nodeList = [];
    this.nodeList.push(new NodeSentence('', null, -1));
  }

  getNodeSentence(sentence) {
    let i = 0;
    let result = undefined;
    while (i < this.nodeList.length && typeof result === 'undefined') {
      if (removePunctuation(this.nodeList[i].sentence.toLowerCase()) === removePunctuation(sentence.toLowerCase())) {
        result = this.nodeList[i];
      }
      i++;
    }
    return result;
  }

  addSentenceNode(sentence, parentSentence, performance) {
    const parentNode = this.getNodeSentence(parentSentence);
    const existingNode = this.getNodeSentence(sentence);
    if(existingNode) {
      existingNode.addParent(parentNode);
      parentNode.addChild(existingNode);
      return existingNode;
    } else if (parentNode) {
      const newNodeSentence = new NodeSentence(sentence, parentNode, performance);
      parentNode.addChild(newNodeSentence);
      this.nodeList.push(newNodeSentence);
      return newNodeSentence;
    }
  }

  getResponse(sentence, parentSentence) {
    let sentenceNode = this.getNodeSentence(sentence);
    if(typeof sentenceNode === 'undefined') {
      sentenceNode = this.addSentenceNode(sentence, parentSentence);
    }
    return this.getBestResponse(sentenceNode);
  }

  getBestResponse(sentenceNode) {
    let response = 'Je ne sais pas quoi répondre';
    let maxPerf = -1;
    if (sentenceNode.hasChild()) {
      shuffle(sentenceNode.children);
      sentenceNode.children.forEach(function(childSentenceNode) {
        if (childSentenceNode.performance > maxPerf) {
          response = childSentenceNode.sentence;
          maxPerf = childSentenceNode.performance;
        }
      });
    }
    if (maxPerf === -1 && typeof this.getNodeSentence(response) === 'undefined') {
      this.addSentenceNode(response, sentenceNode.sentence, 0);
    }
    return response;
  }

  increasePerformance(sentence) {
    const sentenceNode = this.getNodeSentence(sentence);
    sentenceNode.performance += 1;
  }

  decreasePerformance(sentence) {
    const sentenceNode = this.getNodeSentence(sentence);
    sentenceNode.performance -= 1;
  }
}

module.exports = new SmartAgent;