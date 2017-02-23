'use strict';

const NodeSentence = require('./nodeSentence');
const fs = require('fs');
const filePath = './storage.txt';
const circularJson = require('circular-json');

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
    this.nodeList = circularJson.parse(fs.readFileSync(filePath, 'utf8'));
    if (this.nodeList.length<1) {
      this.nodeList.push(new NodeSentence('', null, -1));
    }
  }

  getBestNode() {
    let maxPerf = -1;
    let bestNode = undefined;
    this.nodeList.forEach(function(node) {
      if (node.performance > maxPerf) {
        maxPerf = node.performance;
        bestNode = node;
      }
    });
    return bestNode;
  }

  getBestPathDjikstra(originNode, destinationNode) {
    let unseenNodes = this.nodeList.slice();
    originNode.pathDone = 0;
    while(unseenNodes.length>0) {
      unseenNodes.sort(function(n1, n2) {
        return n1.pathDone > n2.pathDone;
      });
      let node = unseenNodes[0];
      unseenNodes.splice(0, 1);
      node.children.forEach(function (childNode) {
        let dist = node.pathDone + childNode.performance;
        if ((childNode.pathDone || -Infinity) < dist) {
          childNode.pathDone = dist;
          childNode.previous = node;
        }
      });
    }
    let finalWay = [];
    let currNode = destinationNode;
    while (currNode !== originNode && typeof currNode !== 'undefined') {
      finalWay.push(currNode);
      currNode = currNode.previous;
    }
    this.nodeList.forEach(function(node) {
      delete node.previous;
      delete node.pathDone;
    });
    if (currNode === originNode) {
      finalWay.push(currNode);
      finalWay.reverse();
      return finalWay;
    }
    return undefined;
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
    if(typeof result !== 'undefined') {
      this.saveData();
    }
    return result;
  }

  saveData() {
    fs.writeFile(filePath, circularJson.stringify(this.nodeList));
  }

  getResponse(sentence, parentSentence) {
    let sentenceNode = this.getNodeSentence(sentence);
    if(typeof sentenceNode === 'undefined') {
      sentenceNode = this.addSentenceNode(sentence, parentSentence || '');
    }
    return this.getBestResponse(sentenceNode);
  }

  getBestResponse (sentenceNode) {
    let bestNode = this.getBestNode();
    let bestPath = this.getBestPathDjikstra(sentenceNode, bestNode);
    if (typeof bestPath !== 'undefined' && bestPath.length >1) {
      return bestPath[1].sentence; // bestPath[0] is the origin node, so the next is the best response
    }
    return this.getBestChildrenResponse(sentenceNode);
  }

  getBestChildrenResponse(sentenceNode) {
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