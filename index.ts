import DataEditor from 'node-data-editor'
import { LowDbAdapter } from './lowdb-adapter.js'

const submissionModel = new DataEditor.DataModel({
  schema: {
    $id: 'submissions',
    properties: {
      id: { type: 'string', minLength: 1 },
      quasselstrippe: { type: 'string', minLength: 1 },
      answers: { type: 'array', default: [] },
      hide: { type: 'boolean', default: false },
      timestamp: { type: 'number', default: 0 }
    },
    primaryKey: 'id',
    required: ['id'],
    titleTemplate: '<%= quasselstrippe %>:<%= id %>'
  },
  adapter: new LowDbAdapter('data/database.json', 'submissions', 'id', [])
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
  adapter: new LowDbAdapter('data/database.json', 'quasselstrippen', 'name', [])
})


DataEditor.start({
  models: [submissionModel, quasselstrippeModel],
  port: 3000
}).then((server) => { console.log('Editor is available on localhost:3000') })