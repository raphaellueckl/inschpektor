#!/usr/bin/env node

require('console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l'
});

const express = require('express');
const history = require('connect-history-api-fallback');

const NEIGHBOR_RESOURCE = require('./resource/neighbor.resource');
const NODE_RESOURCE = require('./resource/node.resource');
const USER_RESOURCE = require('./resource/user.resource');
const IRI_SERVICE = require('./service/iri.service');
const DB_SERVICE = require('./service/db.service');
const FETCHER_JOB = require('./fetcher.job');

DB_SERVICE.createTables();
DB_SERVICE.initializeState(
  IRI_SERVICE.protocol,
  IRI_SERVICE.iriIp,
  IRI_SERVICE.iriPort,
  IRI_SERVICE.iriFileLocation
);

const app = express();
app.set('port', process.env.PORT || 8732);
app.use(express.json());
if (process.env.NODE_ENV === 'dev') {
  console.log('Environment: DEV');
} else {
  console.log('Environment: PROD');
  app.use(history());
  app.use(express.static(__dirname + '/../dist'));
}

NEIGHBOR_RESOURCE.init(app);
NODE_RESOURCE.init(app);
USER_RESOURCE.init(app);

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

FETCHER_JOB();
