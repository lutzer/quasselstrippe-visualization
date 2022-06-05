import DataEditor from 'node-data-editor'
import { LowDbAdapter } from './lowdb-adapter.js'
import { config } from './config.js'
import httpProxy from 'http-proxy'
import http from 'http'

const submissionModel = new DataEditor.DataModel({
  schema: {
    $id: 'submissions',
    properties: {
      id: { type: 'string', readonly : true, autoIncrement: true },
      quasselstrippe: { type: 'string', minLength: 1 },
      data: { type: 'array', default: [] },
      hide: { type: 'boolean', default: false },
      timestamp: { type: 'number', default: 0, readonly: true }
    },
    primaryKey: 'id',
    required: ['quasselstrippe'],
    titleTemplate: '<%= quasselstrippe %>:<%= id %>'
  },
  adapter: new LowDbAdapter('data/database.json', 'submissions', 'id', { autoIncrement: true, autoTimestamp: true })
})

const quasselstrippeModel = new DataEditor.DataModel({
  schema: {
    $id: 'quasselstrippen',
    properties: {
      name: { type: 'string', minLength: 1 },
      group: { type: 'number', default: 0, minimum: 0, maximum: 10 }
    },
    primaryKey: 'name',
    required: ['name'],
    titleTemplate: '<%= name %>',
    links : [ { model: 'submissions', key: 'name', foreignKey: 'quasselstrippe' } ]

  },
  adapter: new LowDbAdapter('data/database.json', 'quasselstrippen', 'name')
})

// var proxy = httpProxy.createProxyServer();
// http.createServer(function (req, res) {
//   const { url } = req 
//   if (url?.startsWith("/api/")) {
//     proxy.web(req, res, { target: 'http://localhost:3000/api/' });
//   }

  
// }).listen(8008);


DataEditor.start({
  models: [submissionModel, quasselstrippeModel],
  port: 3000,
  credentials: {
    login: config.credentials_name,
    password: config.credentials_password
  }
}).then((server) => { console.log('Editor is available on localhost:3000') })