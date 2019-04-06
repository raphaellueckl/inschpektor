class NodeState {
  constructor() {
    this.currentOwnNodeInfo = undefined;
    this.restartNodeCommand = undefined;
    this.persistedNeighbors = undefined;
    this.loginToken = undefined;
    this.hashedPw = undefined;
    this.notificationTokens = [];
    this.neighborAdditionalData = new Map();
  }
}

const nodeState = new NodeState();
module.exports = nodeState;
