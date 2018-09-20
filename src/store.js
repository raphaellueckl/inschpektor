import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import axios from 'axios';

axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

let iriIp = null;
let iriPort = null;

const state = {
  hostNode: `${iriIp}:${iriPort}`,
  token: null,
  loading: false,
  nodeInfo: null,
  iriIp: null,
  neighbors: null,
  nodeError: null,
  authenticated: false,
  password: null,
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_NODE_INFO(state, info) {
    state.nodeInfo = info;
  },
  SET_IRI_IP(state, ipAndPort) {
    state.iriIp = ipAndPort.ip;
    state.hostNode = `${ipAndPort.ip}:${ipAndPort.port}`;
  },
  SET_NEIGHBORS(state, neighbors) {
    state.neighbors = neighbors;
  },
  SET_ERROR(state, nodeError) {
    state.nodeError = nodeError;
  },
  SET_PASSWORD(state, password) {
    state.password = password;
  },
  USER_AUTHENTICATED(state, authenticated) {
    state.authenticated = authenticated;
  },
};

const actions = {
  login({commit}, passwordOrToken) {
    return axios.post('/api/login', {passwordOrToken})
    .then(response => {
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
      commit('SET_TOKEN', response.data.token);
      commit('USER_AUTHENTICATED', true);
    })
    .catch(error => console.log('Unsuccessful login attempt.'));
  },
  logout({commit}) {
    return new Promise((resolve) => {
      localStorage.removeItem('token');
      commit('SET_TOKEN', null);
      resolve();
    });
  },
  fetchNodeInfo({commit}) {
    axios('/api/node-info')
    .then(response => {
      commit('SET_NODE_INFO', response.data);
    })
    .catch(error => {
      commit('SET_NODE_INFO', null);
      commit('SET_ERROR', error.response.data);
    });
  },
  fetchIriIp({commit}) {
    axios('/api/iri-ip')
    .then(response => {
      commit('SET_IRI_IP', response.data);
    })
    .catch(error => {
    });
  },
  fetchNeighbors({commit}) {
    axios('/api/neighbors').then(response => {
      commit('SET_NEIGHBORS', response.data);
    });
  },
  setHostNodeIp({dispatch, commit}, ipAndPw) {
    let nodeIp = ipAndPw.nodeIp;
    let port = '14265';
    if (nodeIp.includes(':')) {
      port = nodeIp.substring(nodeIp.indexOf(':') + 1);
      nodeIp = nodeIp.substring(0, nodeIp.indexOf(':'));
    }
    axios.post('/api/host-node-ip', {nodeIp, port, password: ipAndPw.password})
    .then(response => {
      iriIp = nodeIp;
      iriPort = port;
      if (response.data.token) {
        commit('SET_TOKEN', response.data.token);
        commit('USER_AUTHENTICATED', true);
        commit('SET_IRI_IP', ipAndPw.nodeIp);
      } else {
        commit('USER_AUTHENTICATED', false);
      }
      commit('SET_ERROR', null);
      dispatch('fetchNeighbors');
      dispatch('fetchNodeInfo');
    })
    .catch(error => console.log('error setting node ip'));
  },
  addNeighbor({dispatch, commit}, neighborSubmission) {
    axios.post('/api/neighbor', {name: neighborSubmission.name, address: neighborSubmission.address})
    .then(response => {
      dispatch('fetchNeighbors');
    })
    .catch(error => console.log('Error adding neighbor'));
  },
  addNeighborNick({commit}, neighbor) {
    axios.post('/api/neighbor/nick', {name: neighbor.name, fullAddress: `${neighbor.protocol}://${neighbor.address}`})
    .then(response => {
    })
    .catch(error => console.log('Error when setting nick for neighbor'));
  },
  removeNeighbor({dispatch, commit}, neighbor) {
    const address = `${neighbor.protocol}://${neighbor.address}`;
    axios.delete('/api/neighbor', {data: {address}})
    .then(response => {
      dispatch('fetchNeighbors');
    })
    .catch(error => console.log('Error deleting neighbor'));
  },
  addNickname({dispatch}, neighbor) {
    const address = `${neighbor.protocol}://${neighbor.address}`;
    axios.delete('/api/neighbor', {data: {address}})
    .then(response => {
      dispatch('fetchNeighbors');
    })
    .catch(error => console.log('Error deleting neighbor'));
  },
  loadPeriodically({dispatch}) {
    dispatch('fetchNeighbors');
    dispatch('fetchNodeInfo');
  }
};

const getters = {
  token: state => state.token,
  loading: state => state.loading,
  nodeInfo: state => state.nodeInfo,
  iriIp: state => state.iriIp,
  hostNode: state => state.hostNode,
  neighbors: state => state.neighbors,
  nodeError: state => state.nodeError,
  authenticated: state => state.authenticated
};

const storeModule = {
  state,
  mutations,
  actions,
  getters
};

export default new Vuex.Store({
  modules: {
    storeModule
  }
});
