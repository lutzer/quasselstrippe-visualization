import DataEditor from 'node-data-editor'
import { LowDbAdapter } from './lowdb-adapter.js'
import { config } from './config.js'

import express from 'express'
import path from 'path'
import http from 'http'
import url from 'url';
import proxy from 'express-http-proxy'


import {fileURLToPath} from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const port: number = 3000

class App {
    private server: http.Server
    private port: number

    constructor(port: number) {
        this.port = port

        // serve frontend
        const app = express()
        app.use(express.static(path.join(__dirname, './../../frontend/dist/client')))

        startBackend(3001)
        // proxy api requests to other port
        const apiProxy = proxy('http://localhost:3001/api/', {
            proxyReqPathResolver: req => url.parse(req.baseUrl).path!
        });
        app.use('/api/*', apiProxy);

        this.server = new http.Server(app)
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`)
        })
    }
}

new App(port).Start()

function startBackend(port: number) {
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
    adapter: new LowDbAdapter('./../data/database.json', 'submissions', 'id', { autoIncrement: true, autoTimestamp: true })
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
    adapter: new LowDbAdapter('./../data/database.json', 'quasselstrippen', 'name')
  })
  
  DataEditor.start({
    models: [submissionModel, quasselstrippeModel],
    port: port,
    credentials: {
      login: config.credentials_name,
      password: config.credentials_password
    }
  })
}
