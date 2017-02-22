'use strict';

const NodeSentence = require('./nodeSentence');
const fs = require('fs');

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
    this.nodeList = JSON.parse(fs.readFileSync('./storage.txt', 'utf8'));
    if (this.nodeList.length<1) {
      this.nodeList.push(new NodeSentence('', null, -1));
    }
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
    let result = undefined;
    if(existingNode) {
      parentNode.children.push(existingNode);
      result = existingNode;
    } else if (parentNode) {
      const newNodeSentence = new NodeSentence(sentence, performance);
      parentNode.children.push(newNodeSentence);
      this.nodeList.push(newNodeSentence);
      result = newNodeSentence;
    }
    if(typeof result!== 'undefined') {
      this.saveData();
    }
  }

  saveData() {
    fs.writeFile('./storage.txt', JSON.stringify(this.nodeList));
  }

  getResponse(sentence, parentSentence) {
    let sentenceNode = this.getNodeSentence(sentence);
    if(typeof sentenceNode === 'undefined') {
      sentenceNode = this.addSentenceNode(sentence, parentSentence || '');
    }
    return this.getBestResponse(sentenceNode);
  }

  getBestResponse(sentenceNode) {
    let response = 'Je ne sais pas quoi répondre';
    let maxPerf = -1;
    if (sentenceNode && sentenceNode.children.length>0) {
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