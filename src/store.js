import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import axios from 'axios';

const iri_ip = '192.168.188.20';
const iri_port = '14265';

const state = {
  hostNode: `${iri_ip}:${iri_port}`,
  token: null,
  loading: false,
  nodeInfo: null,
  iriIp: null,
  neighbors: null,
  nodeError: null
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  LOGIN_PENDING(state) {
    state.loading = true;
  },
  LOGIN_SUCCESS(state) {
    state.loading = false;
  },
  SET_NODE_INFO(state, info) {
    state.nodeInfo = info;
  },
  SET_IRI_IP(state, ip) {
    state.iriIp = ip;
  },
  SET_NEIGHBORS(state, neighbors) {
    state.neighbors = neighbors;
  },
  SET_ERROR(state, nodeError) {
    state.nodeError = nodeError;
  },
};

const actions = {
  login({commit}) {
    return axios.post('/api/login').then(response => {
      localStorage.setItem('token', response.data.token);
      commit('SET_TOKEN', response.data.token);
    });
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
  setHostNodeIp({dispatch, commit}, nodeIp) {
    axios.post('/api/host-node-ip', {nodeIp: nodeIp})
    .then(response => {
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
  removeNeighbor({dispatch, commit}, neighbor) {
    const address = neighbor.address.split(':')[0];
    axios.delete('/api/neighbor', {data: {address}})
    .then(response => {
      dispatch('fetchNeighbors');
    })
    .catch(error => console.log('Error deleting neighbor'));
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
};

const storeModule = {
  state,
  mutations,
  actions,
  getters
};

function createIriRequest(command) {
  return {
    url: `http://${iri_ip}:${iri_port}`,
    data: {'command': command},
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-IOTA-API-Version': '1'
    }
  };
}

export default new Vuex.Store({
  modules: {
    storeModule
  }
});
