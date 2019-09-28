#!/usr/bin/env node

require('../node_modules/console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l'
});

const express = require('express');
const axios = require('axios');
const history = require('connect-history-api-fallback');

const NODE_STATE = require('./state/node.state');
const DB_SERVICE = require('./service/db.service');
const IRI_SERVICE = require('./service/iri.service');
const AUTH_SERVICE = require('./service/auth.service');
const AUTH_RESOURCE = require('./resource/auth.resource');
const NEIGHBOR_RESOURCE = require('./resource/neighbor.resource');
const NODE_RESOURCE = require('./resource/node.resource');
const HOST_RESOURCE = require('./resource/host.resource');

const FETCHER_JOB = require('./fetcher.job');

const app = express();

app.set('listen_address', process.env.ADDRESS || 'localhost');
app.set('port', process.env.PORT || 8732);

app.use(express.json());
if (process.env.NODE_ENV === 'dev') {
  console.log('Environment: DEV');
} else {
  console.log('Environment: PROD');
  app.use(history());
  app.use(express.static(__dirname + '/../dist'));
}

AUTH_RESOURCE.init(app);
NEIGHBOR_RESOURCE.init(app);
NODE_RESOURCE.init(app);
HOST_RESOURCE.init(app);

let initHostData = undefined;
if (
  process.env.IRI_PROTOCOL &&
  process.env.IRI_ADDRESS &&
  process.env.IRI_PORT &&
  process.env.PASSWORD &&
  process.env.IRI_CONFIG_PATH &&
  process.env.RESTART_IRI_COMMAND
) {
  initHostData = {
    IRI_PROTOCOL: process.env.IRI_PROTOCOL,
    IRI_ADDRESS: process.env.IRI_ADDRESS,
    IRI_PORT: process.env.IRI_PORT,
    PASSWORD: process.env.PASSWORD,
    IRI_CONFIG_PATH: process.env.IRI_CONFIG_PATH,
    RESTART_IRI_COMMAND: process.env.RESTART_IRI_COMMAND
  };
}

DB_SERVICE.createAndInitializeTables(initHostData);

app.listen(app.get('port'), app.get('listen_address'), () => {
  console.log(
    `Find the server at: http://${app.get('listen_address')}:${app.get(
      'port'
    )}/`
  );
});

FETCHER_JOB();
