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
  neighbors: null
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
  SET_NEIGHBORS(state, neighbors) {
    state.neighbors = neighbors;
  }
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
    axios('/api/node-info').then(response => {
      commit('SET_NODE_INFO', response.data);
    });
  },
  fetchNeighbors({commit}) {
    axios('/api/neighbors').then(response => {
      commit('SET_NEIGHBORS', response.data);
    });
  }
};

const getters = {
  token: state => state.token,
  loading: state => state.loading,
  nodeInfo: state => state.nodeInfo,
  hostNode: state => state.hostNode,
  neighbors: state => state.neighbors,
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
